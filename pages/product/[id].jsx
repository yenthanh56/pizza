import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";
const Product = ({ pizza }) => {
	const dispatch = useDispatch();

	const [quantity, setQuantity] = useState(1);
	const [price, setPrice] = useState(pizza.prices[0]);
	const [size, setSize] = useState(0);
	const [extras, setExtra] = useState([]);
	// const pizza = {
	//   id: 1,
	//   img: "/img/pizza.png",
	//   name: "CAMPAGNOLA",
	//   price: [19.9, 23.9, 27.9],
	//   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis arcu purus, rhoncus fringilla vestibulum vel, dignissim vel ante. Nulla facilisi. Nullam a urna sit amet tellus pellentesque egestas in in ante.",
	// };

	const onChangePrice = (number) => {
		setPrice(price + number);
	};

	const onSizeHandler = (sizeIndex) => {
		const difference = pizza.prices[sizeIndex] - pizza.prices[size];
		setSize(sizeIndex);
		onChangePrice(difference);
	};

	const optionOnchangeHandler = (e, option) => {
		const checked = e.target.checked;
		if (checked) {
			onChangePrice(option.price);
			setExtra((pre) => [...pre, extras]);
		} else {
			onChangePrice(-option.price);
			setExtra(extras.filter((extra) => extra.id !== option.id));
		}
	};

	const onAddHandler = () => {
		dispatch(
			addProduct({ ...pizza, extras, price, quantity: Number(quantity) })
		);
	};

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<div className={styles.imgContainer}>
					<Image
						src={pizza.img}
						objectFit="contain"
						layout="fill"
						alt=""
					/>
				</div>
			</div>
			<div className={styles.right}>
				<h1 className={styles.title}>{pizza.title}</h1>
				<span className={styles.price}>${price}</span>
				<p className={styles.desc}>{pizza.desc}</p>
				<h3 className={styles.choose}>Choose the size</h3>
				<div className={styles.sizes}>
					<div
						className={styles.size}
						onClick={() => onSizeHandler(0)}
					>
						<Image src="/img/size.png" layout="fill" alt="" />
						<span className={styles.number}>Small</span>
					</div>
					<div
						className={styles.size}
						onClick={() => onSizeHandler(1)}
					>
						<Image src="/img/size.png" layout="fill" alt="" />
						<span className={styles.number}>Medium</span>
					</div>
					<div
						className={styles.size}
						onClick={() => onSizeHandler(2)}
					>
						<Image src="/img/size.png" layout="fill" alt="" />
						<span className={styles.number}>Large</span>
					</div>
				</div>
				<h3 className={styles.choose}>Choose additional ingredients</h3>
				<div className={styles.ingredients}>
					{pizza.extraOptions.map((option) => (
						<div className={styles.option} key={option._id}>
							<input
								type="checkbox"
								id={option.text}
								name={option.text}
								className={styles.checkbox}
								onChange={(e) =>
									optionOnchangeHandler(e, option)
								}
							/>
							<label htmlFor={option.text}>{option.text}</label>
							<span className={styles.bonus}>
								Bonus price :${option.price}{" "}
							</span>
						</div>
					))}
					{/* <div className={styles.option}>
						<input
							className={styles.checkbox}
							type="checkbox"
							id="cheese"
							name="cheese"
						/>
						<label htmlFor="cheese">Extra Cheese</label>
					</div>
					<div className={styles.option}>
						<input
							className={styles.checkbox}
							type="checkbox"
							id="spicy"
							name="spicy"
						/>
						<label htmlFor="spicy">Spicy Sauce</label>
					</div>
					<div className={styles.option}>
						<input
							className={styles.checkbox}
							type="checkbox"
							id="garlic"
							name="garlic"
						/>
						<label htmlFor="garlic">Garlic Sauce</label>
					</div> */}
				</div>
				<div className={styles.add}>
					<input
						type="number"
						defaultValue={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						className={styles.quantity}
					/>
					<button className={styles.button} onClick={onAddHandler}>
						Add to Cart
					</button>
				</div>
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

export default Product;
