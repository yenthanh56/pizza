import cookie from "cookie";

const handler = async (req, res) => {
	const { method } = req;
	if (method === "POST") {
		const { username, password } = req.body;
		if (
			username === process.env.ADMIN_USERNAME &&
			password === process.env.ADMIN_PASSWORD
		) {
			res.setHeader(
				"Set-Cookie",
				cookie.serialize("token", process.env.TOKEN, {
					maxAge: 60 * 60,
					sameSite: "strict",
					path: "/",
				})
			);
			return res.status(200).json("Successfully");
		} else {
			return res.status(400).json("Wrong credentials!");
		}
	}
};

export default handler;
