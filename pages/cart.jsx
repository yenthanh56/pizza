import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import styles from "../styles/Cart.module.css";
import {
	increaseProduct,
	decreaseProduct,
	removeProduct,
	reset,
} from "../redux/cartSlice";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import { useRouter } from "next/router";
import OrderDetail from "../components/OrderDetail";

// person account person123@personal.example.com
// pass 123456789

// business account business456@business.example.com
// 123456789

const Cart = () => {
	// This values are the props in the UI
	const [cash, setCash] = useState(false);

	const router = useRouter();
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const products = useSelector((state) => state.cart.products);
	const totalPrice = () => {
		let total = 0;
		products.forEach((item) => {
			total += item?.quantity * item?.price;
		});
		return total.toFixed(2);
	};
	const amount = totalPrice();
	const currency = "USD";
	const style = { layout: "vertical" };
	const increaseProductHandler = (product) => {
		dispatch(increaseProduct(product));
		return;
	};
	const decreaseProductHandler = (product) => {
		if (product?.quantity === 1) {
			dispatch(removeProduct(product));
			return;
		}
		dispatch(decreaseProduct(product));
		return;
	};
	const removeProductHandler = (product) => {
		dispatch(removeProduct(product));
		return;
	};

	const createOrder = async (data) => {
		try {
			const res = await axios.post(
				"http://localhost:3000/api/orders",
				data
			);
			router.push("/orders/" + res.data._id);
			dispatch(reset());
		} catch (error) {
			console.log(error);
		}
	};

	// Custom component to wrap the PayPalButtons and handle currency changes
	const ButtonWrapper = ({ currency, showSpinner }) => {
		// usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
		// This is the main reason to wrap the PayPalButtons in a new component
		const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

		useEffect(() => {
			dispatch({
				type: "resetOptions",
				value: {
					...options,
					currency: currency,
				},
			});
		}, [currency, showSpinner]);

		return (
			<>
				{showSpinner && isPending && <div className="spinner" />}
				<PayPalButtons
					style={style}
					disabled={false}
					forceReRender={[amount, currency, style]}
					fundingSource={undefined}
					createOrder={(data, actions) => {
						return actions.order
							.create({
								purchase_units: [
									{
										amount: {
											currency_code: currency,
											value: amount,
										},
									},
								],
							})
							.then((orderId) => {
								// Your code here after create the order
								return orderId;
							});
					}}
					onApprove={function (data, actions) {
						return actions.order.capture().then(function (details) {
							// Your code here after capture the order
							const shipping = details.purchase_units[0].shipping;
							createOrder({
								customer: shipping.name.full_name,
								address: shipping.address.address_line_1,
								total: totalPrice(),
								method: 1,
							});
						});
					}}
				/>
			</>
		);
	};
	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<table className={styles.table}>
					<thead>
						<tr className={styles.trTitle}>
							<th>Product</th>
							<th>Name</th>
							<th>Extras</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Control</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{products?.map((product) => (
							<tr className={styles.tr} key={product._id}>
								<td>
									<div className={styles.imgContainer}>
										<Image
											src={product?.img}
											layout="fill"
											objectfit="cover"
											alt=""
										/>
									</div>
								</td>
								<td>
									<span className={styles.name}>
										{product?.title}
									</span>
								</td>
								<td>
									<span className={styles.extras}>
										{product?.extras?.map((extra) => (
											<p key={extra.text}>{extra.text}</p>
										))}
									</span>
								</td>
								<td>
									<span className={styles.price}>
										{product?.price}
									</span>
								</td>
								<td>
									<span className={styles.quantity}>
										{product?.quantity}
									</span>
								</td>
								<td>
									<div className={styles.control}>
										<button
											onClick={() =>
												decreaseProductHandler(product)
											}
										>
											Giảm
										</button>
										<button
											onClick={() =>
												increaseProductHandler(product)
											}
										>
											Tăng
										</button>
										<button
											onClick={() =>
												removeProductHandler(product)
											}
										>
											Xóa
										</button>
									</div>
								</td>
								<td>
									<span className={styles.total}>
										${product?.price * product?.quantity}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={styles.right}>
				<div className={styles.wrapper}>
					<h2 className={styles.title}>CART TOTAL</h2>
					<div className={styles.totalText}>
						<b className={styles.totalTextTitle}>Subtotal:</b>$
						{totalPrice()}
					</div>
					<div className={styles.totalText}>
						<b className={styles.totalTextTitle}>Discount:</b>$0.00
					</div>
					<div className={styles.totalText}>
						<b className={styles.totalTextTitle}>Total:</b>$
						{totalPrice()}
					</div>

					{open ? (
						<div className={styles.paymethod}>
							<button
								className={styles.payment}
								onClick={() => setCash(true)}
							>
								CASH ON DELIVERY
							</button>
							<PayPalScriptProvider
								options={{
									"client-id":
										"AYcgN8nEXJkosXICWlDSmw_bn2fA2X6GOY1OrPBI2p3gA4TNMJVnrSkFfKyqTQYjW8Dgzij9OBBBIAeh",
									components: "buttons",
									currency: "USD",
									"disable-funding": "credit,card,p24",
								}}
							>
								<ButtonWrapper
									currency={currency}
									showSpinner={false}
								/>
							</PayPalScriptProvider>
						</div>
					) : (
						<button
							className={styles.button}
							onClick={() => setOpen(true)}
						>
							CHECKOUT NOW!
						</button>
					)}
				</div>
			</div>
			{cash && (
				<OrderDetail
					total={totalPrice()}
					createOrder={createOrder}
					setCash={setCash}
				/>
			)}
		</div>
	);
};

export default Cart;
