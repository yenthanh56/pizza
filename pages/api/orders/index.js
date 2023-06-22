import dbConnect from "../../../utils/mongose";
import Order from "../../../models/Order";

export default async function handle(req, res) {
	await dbConnect();
	const { method } = req;

	if (method === "GET") {
		try {
			const orderAll = await Order.find();
			return res.status(200).json(orderAll);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	if (method === "POST") {
		try {
			const newOrder = await Order.create(req.body);
			return res.status(200).json(newOrder);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
}
