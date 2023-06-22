import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import AddButton from "../../components/AddButton";
import AddProduct from "../../components/AddProduct";
import EditProduct from "../../components/EditProduct";
import styles from "../../styles/Admin.module.css";
import Login from "./login";
const Index = ({ orders, products }) => {
	const [open, setOpen] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [pizzaList, setPizzaList] = useState(products);
	const [orderList, setOrderList] = useState(orders);
	const status = ["preparing", "on the way", "delivered"];

	const deleteProductHandler = async (id) => {
		try {
			await axios.delete(`http://localhost:3000/api/products/${id}`);
			setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
		} catch (error) {
			console.log(error);
		}
	};
	// step check in order,
	const statusHandler = async (id) => {
		const orderItem = orderList.filter((order) => order._id === id)[0];
		const currentState = orderItem.status;

		try {
			const res = await axios.put(
				`http://localhost:3000/api/orders/${id}`,

				{
					status: currentState + 1,
				}
			);
			setOrderList([
				res.data,
				...orderList.filter((order) => order._id !== id),
			]);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteOrderHandler = async (id) => {
		try {
			await axios.delete(`http://localhost:3000/api/orders/${id}`);
			setOrderList(orderList.filter((order) => order._id !== id));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<AddButton setOpen={setOpen} />

			{open && <AddProduct setOpen={setOpen} />}
			{showEdit && <EditProduct setShowEdit={setShowEdit} />}
			<div className={styles.container}>
				{/* list my product */}
				<div className={styles.item}>
					<h1 className={styles.title}>All Product</h1>
					<table className={styles.table}>
						<thead>
							<tr className={styles.trTitle}>
								<th>Image</th>
								<th>Id</th>
								<th>Title</th>
								<th>Price</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{pizzaList.map((pizza) => (
								<tr className={styles.trTitle} key={pizza._id}>
									<td>
										<Image
											src={pizza.img}
											width={50}
											height={50}
											objectFit="cover"
											alt=""
										/>
									</td>
									<td>{pizza._id.slice(0, 5)}...</td>
									<td>{pizza.title}</td>
									<td>${pizza.prices[0]}</td>
									<td>
										<button
											className={styles.button}
											onClick={() => setShowEdit(true)}
										>
											Edit
										</button>
										<button
											className={styles.button}
											onClick={() =>
												deleteProductHandler(pizza._id)
											}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* list order list  */}
				<div className={styles.item}>
					<h1 className={styles.title}>List User Order</h1>
					<table className={styles.table}>
						<thead>
							<tr className={styles.trTitle}>
								<th>CustomerId</th>
								<th>CustomerName</th>
								<th>Phone</th>
								<th>Address</th>
								<th>Payment</th>
								<th>Status</th>

								<th>Total</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{orderList.map((order) => (
								<tr className={styles.trTitle} key={order._id}>
									<td>{order._id.slice(0, 5)}...</td>
									<td>{order.customer}</td>
									<td>{order.phone}</td>
									<td>{order.address}</td>
									<td>
										{order.method === 0 ? (
											<span>Cash</span>
										) : (
											<span>Paid</span>
										)}
									</td>
									<td>
										{order.status >= 3
											? "Đã Giao"
											: status[order.status]}
									</td>

									<td>${order.total}</td>

									<td>
										{order.status >= 3 ? (
											<button
												className={styles.button}
												onClick={() =>
													deleteOrderHandler(
														order._id
													)
												}
											>
												Delete
											</button>
										) : (
											<button
												className={styles.button}
												onClick={() =>
													statusHandler(order._id)
												}
											>
												Next Stage
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = async (ctx) => {
	const myCookie = ctx.req?.cookies || "";
	if (myCookie.token !== process.env.TOKEN) {
		return {
			redirect: {
				destination: "/admin/login",
				permanent: false,
			},
		};
	}
	const productRes = await axios.get("http://localhost:3000/api/products");
	const orderRes = await axios.get("http://localhost:3000/api/orders");

	return {
		props: {
			products: productRes.data,
			orders: orderRes.data,
		},
	};
};

export default Index;
