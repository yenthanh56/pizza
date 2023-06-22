import React from "react";
import styles from "../styles/AddButton.module.css";
const AddButton = ({ setOpen }) => {
	return (
		<div className={styles.button} onClick={() => setOpen(true)}>
			Add New Pizza
		</div>
	);
};

export default AddButton;
