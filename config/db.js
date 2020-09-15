const mongoose = require('mongoose');

const MONGOURI = "<your-base-url>";

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