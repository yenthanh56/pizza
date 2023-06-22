import React, { useState } from "react";
import styles from "../styles/OrderDetail.module.css";

const OrderDetail = (props) => {
	const { total, createOrder, setCash } = props;
	const [customer, setCustomer] = useState("");
	const [phone, setPhone] = useState(0);
	const [address, setAddress] = useState("");
	const payingHandler = () => {
		createOrder({
			customer,
			phone: Number(phone),
			address,
			total,
			method: 0,
		});
		console.log(typeof customer, typeof Number(phone), typeof address);
	};
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<h1 className={styles.title}>
					Your will paying $12 for your buy product
				</h1>
				<div className={styles.yourname}>
					<label className={styles.label}>what yours name ?</label>
					<input
						type="text"
						placeholder="please fill out this form "
						className={styles.input}
						onChange={(e) => setCustomer(e.target.value)}
					/>
				</div>
				<div className={styles.yourphone}>
					<label className={styles.label}>Phone</label>
					<input
						type="text"
						placeholder="please fill out this form "
						className={styles.input}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className={styles.youraddress}>
					<label className={styles.label}>Address</label>
					<input
						type="text"
						placeholder="please fill out this form "
						className={styles.input}
						onChange={(e) => setAddress(e.target.value)}
					/>
				</div>
				<div className={styles.control}>
					<button onClick={payingHandler}>PAY</button>
				</div>
				<div className={styles.close} onClick={() => setCash(false)}>
					<button>x</button>
				</div>
			</div>
		</div>
	);
};

export default OrderDetail;
