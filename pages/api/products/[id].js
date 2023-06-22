import dbConnect from "../../../utils/mongose";
import Product from "../../../models/Product";
export default async function handle(req, res) {
	await dbConnect();

	const {
		method,
		query: { id },
		cookies,
	} = req;
	const token = cookies.token;

	if (method === "GET") {
		try {
			const product = await Product.findById(id);
			return res.status(200).json(product);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	if (method === "DELETE") {
		// if (!token || token !== process.env.TOKEN) {
		// 	return res.status(401).json("Not authenticated");
		// }
		try {
			await Product.findByIdAndDelete(id);
			return res.status(200).json("The product has been deleted");
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	if (method === "PUT") {
		try {
			const product = await Product.findByIdAndUpdate(id, req.body, {
				new: true,
			});
			return res.status(200).json(product);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
}
