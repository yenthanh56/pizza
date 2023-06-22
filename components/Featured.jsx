import styles from "../styles/Featured.module.css";
import Image from "next/image";
import { useState } from "react";

const Featured = () => {
	const [index, setIndex] = useState(0);
	const images = [
		"/img/AGYFLDKW7BF2ZFIBE33P7AIRTM.jpg",
		"/img/pizza-slice-11127970.jpg",
		"/img/istockphoto-496546118-1024x1024.jpg",
	];

	const handleArrow = (direction) => {
		if (direction === "l") {
			setIndex(index === 0 ? images.length - 1 : (prev) => prev - 1);
		}
		if (direction === "r") {
			setIndex(index === images.length - 1 ? 0 : (prev) => prev + 1);
		}
	};

	return (
		<div className={styles.container}>
			<div
				className={styles.arrowContainer}
				style={{ left: 0 }}
				onClick={() => handleArrow("l")}
			>
				<Image
					src="/img/arrowl.png"
					alt=""
					layout="fill"
					objectFit="contain"
				/>
			</div>
			<div
				className={styles.wrapper}
				style={{ transform: `translateX(${-100 * index}vw)` }}
			>
				{images.map((img, i) => (
					<div className={styles.imgContainer} key={i}>
						<Image
							src={img}
							alt=""
							layout="fill"
							objectFit="contain"
						/>
					</div>
				))}
			</div>
			<div
				className={styles.arrowContainer}
				style={{ right: 0 }}
				onClick={() => handleArrow("r")}
			>
				<Image
					src="/img/arrowr.png"
					layout="fill"
					alt=""
					objectFit="contain"
				/>
			</div>
		</div>
	);
};

export default Featured;
