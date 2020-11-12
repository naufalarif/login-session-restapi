const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://admin123:admin123@cluster0.bchjj.mongodb.net/node-auth?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
	try {
		await mongoose.connect(MONGOURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (e) {
		console.log(e);
		throw e;
	}
};

module.exports = InitiateMongoServer;