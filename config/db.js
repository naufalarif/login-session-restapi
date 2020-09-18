const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://<user>:<password>@cluster0.bchjj.mongodb.net/<databasename>?retryWrites=true&w=majority";

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