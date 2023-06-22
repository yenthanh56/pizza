import dbConnect from "../../../utils/mongose";
import Product from "../../../models/Product";
export default async function handle(req, res) {
	const { method, cookies } = req;
	await dbConnect();
	const token = cookies.token;

	if (method === "GET") {
		try {
			const getProduct = await Product.find();
			return res.status(200).json(getProduct);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	if (method === "POST") {
		// if (!token || token !== process.env.TOKEN) {
		// 	return res.status(401).json("Not authenticated");
		// }

		try {
			const product = await Product.create(req.body);
			return res.status(200).json(product);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
}
