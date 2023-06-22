import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../../styles/login.module.css";
const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const router = useRouter();

	const loginAdminHandler = async (e) => {
		e.preventDefault();

		try {
			await axios.post("http://localhost:3000/api/login", {
				username,
				password,
			});
			router.push("/admin");
		} catch (error) {
			setError(true);
		}
	};

	return (
		<form className={styles.container} onSubmit={loginAdminHandler}>
			<div className={styles.wrapper}>
				<h1 className={styles.title}>Admin Dashboard</h1>
				<input
					type="text"
					className={styles.input}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="username..."
				/>
				<input
					type="password"
					className={styles.input}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="password..."
				/>
				<button className={styles.button}>Sign in</button>
				{error && (
					<span className={styles.error}>Wrong Credentials!</span>
				)}
			</div>
		</form>
	);
};

export default Login;
