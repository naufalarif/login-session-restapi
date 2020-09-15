const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
	// check token header
	const token = req.header("token");
	if (!token) return res.status(401).json({ message: "Auth Erros" });

	try {
		const decoded = jwt.verify(token, "randomString");
		req.user = decoded.user;
		next();
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: "Invalid Token" });
	}
};