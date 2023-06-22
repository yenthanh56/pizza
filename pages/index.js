import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import AddButton from "../components/AddButton";
import AddProduct from "../components/AddProduct";
import Featured from "../components/Featured";
import PizzaList from "../components/PizzaList";
import styles from "../styles/Home.module.css";

export default function Home({ pizzaList, admin }) {
	console.log(pizzaList);
	const [open, setOpen] = useState(false);
	return (
		<div className={styles.container}>
			<Head>
				<title>Pizza Restaurant in Newyork</title>
				<meta name="description" content="Best pizza shop in town" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Featured />
			{admin && <AddButton setOpen={setOpen} />}
			<PizzaList pizzaList={pizzaList} />
			{open && <AddProduct setOpen={setOpen} />}
		</div>
	);
}

export const getServerSideProps = async (ctx) => {
	const myCookie = ctx.req?.cookies || "";
	let admin = false;
	if (myCookie.token === process.env.TOKEN) {
		admin = true;
	}
	const res = await axios.get("http://localhost:3000/api/products");
	return {
		props: {
			pizzaList: res.data,
			admin,
		},
	};
};
