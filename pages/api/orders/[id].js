import dbConnect from "../../../utils/mongose";
import Order from "../../../models/Order";
export default async function handle(req, res) {
	await dbConnect();

	const {
		method,
		query: { id },
	} = req;

	if (method === "GET") {
		try {
			const order = await Order.findById(id);
			return res.status(200).json(order);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	if (method === "PUT") {
		try {
			const product = await Order.findByIdAndUpdate(id, req.body, {
				new: true,
			});
			return res.status(200).json(product);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	if (method === "DELETE") {
		try {
			await Order.findByIdAndDelete(id);
			return res.status(200).json("The Order has been deteled");
		} catch (error) {
			return res.status(500).json(error);
		}
	}
}
