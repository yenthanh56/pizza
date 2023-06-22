import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import styles from "../styles/EditProduct.module.css";
const EditProduct = ({ setShowEdit, pizza }) => {
	const router = useRouter();
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState(null);
	const [desc, setDesc] = useState(null);
	const [prices, setPrices] = useState([]);

	// add extraOption
	const [extraOptions, setExtraOptions] = useState([]);
	// state contain value
	const [extra, setExtra] = useState(null);

	const onChangePrice = (e, index) => {
		const currentPrice = prices;
		currentPrice[index] = e.target.value;
		setPrices(currentPrice);
	};

	const extraInputHandler = (e) => {
		setExtra({
			...extra,
			[e.target.name]: e.target.value,
		});
	};
	const extraHandler = () => {
		setExtraOptions((pre) => [...pre, extra]);
	};

	const createHandler = async () => {
		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", "uploads");
		try {
			const uploadRes = await axios.post(
				"https://api.cloudinary.com/v1_1/dsfoqe4fq/image/upload",
				data
			);
			const { url } = uploadRes.data;
			const newProduct = {
				title,
				desc,
				prices,
				extraOptions,
				img: url,
			};
			await axios.put(
				`http://localhost:3000/api/products/${pizza._id}`,
				newProduct
			);
			setShowEdit(false);
			router.reload();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// Prefetch the dashboard page
		router.prefetch("/admin");
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.close}>
					<button onClick={() => setShowEdit(false)}>x</button>
				</div>
				<h1 className={styles.title}>EditProduct</h1>
				<div className={styles.item}>
					<label className={styles.label}>Choose an image</label>
					<input
						type="file"
						className={styles.input}
						onChange={(e) => setFile(e.target.files[0])}
					/>
				</div>
				<div className={styles.item}>
					<label className={styles.label}>Title</label>
					<input
						type="text"
						className={styles.input}
						defaultValue={pizza?.title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className={styles.item}>
					<label className={styles.label}>Description</label>
					<textarea
						type="text"
						className={styles.textarea}
						rows={4}
						style={{ resize: "none" }}
						defaultValue={pizza?.desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
				</div>
				<div className={`${styles.item} ${styles.prices}`}>
					<label className={styles.label}>Prices</label>
					<input
						className={`${styles.input} ${styles.inputSm}`}
						type="number"
						placeholder="Small"
						defaultValue={pizza?.prices[0]}
						onChange={(e) => onChangePrice(e, 0)}
					/>
					<input
						className={`${styles.input} ${styles.inputSm}`}
						type="number"
						placeholder="Medium"
						defaultValue={pizza?.prices[1]}
						onChange={(e) => onChangePrice(e, 1)}
					/>
					<input
						className={`${styles.input} ${styles.inputSm}`}
						type="number"
						placeholder="Large"
						defaultValue={pizza?.prices[2]}
						onChange={(e) => onChangePrice(e, 2)}
					/>
				</div>
				<div className={styles.item}>
					<label className={styles.label}>Extra</label>
					<div className={styles.extra}>
						<input
							type="text"
							className={`${styles.input} ${styles.inputSm}`}
							placeholder="Item"
							name="text"
							onChange={extraInputHandler}
						/>
						<input
							type="number"
							className={`${styles.input} ${styles.inputSm}`}
							placeholder="Price"
							name="price"
							onChange={extraInputHandler}
						/>
						<button
							className={styles.extrabutton}
							onClick={extraHandler}
						>
							Add
						</button>
					</div>
					{/* when add Items extraOptions */}
					{/* map all Items */}
					<div className={styles.extraItems}>
						{extraOptions.map((extraOption) => (
							<span
								key={extraOption.text}
								className={styles.extraOption}
							>
								{extraOption?.text} : {extraOption?.price}
							</span>
						))}
					</div>
				</div>

				<button className={styles.createbutton} onClick={createHandler}>
					Create
				</button>
			</div>
		</div>
	);
};

export const getServerSideProps = async ({ params }) => {
	const res = await axios.get(
		`http://localhost:3000/api/products/${params.id}`
	);
	return {
		props: {
			pizza: res.data,
		},
	};
};

export default EditProduct;
