const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/User");
const auth = require("../middleware/auth");



/**
* @method - POST
* @param - /signup
* @description - User Sign Up
*/

// endpoint path
router.post("/signup", 
	// set rule when do sign up
	[
		body("username", "Please enter a valid username")
			.not()
			.isEmpty(),
		body("email", "Please enter a valid email")
			.isEmail(),
		body("password", "Passowrd must at least 5 characters")
			.isLength({ min: 5 })
	], 

	// callback function
	async (req, res) => {

		// check if error or not
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		// deconstruct
		const { username, email, password } = req.body; // THE POINT IS HERE

		try {
			// find email if already exist or not
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					msg: "User Already Exists"
				});
			}

			// create new user data which require username, email, password
			user = new User({ username, email, password }); // THE POINT IS HERE

			// encrypt password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			// save user to database
			await user.save(); // THE POINT IS HERE

			// set payload
			const payload = {
				user: {
					id: user.id
				}
			};

			// create jwt token if payload not empty
			jwt.sign(
				payload,
				"randomString", // token key
				{ expiresIn: 10000 },
				(err, token) => {
					if (err) throw err;
					// if success, give token
					res.status(200).json({
						token
					});
				}
			);
		} catch (err) {
			// error while saving
			console.log(err.message);
			res.status(500).send("Error in Saving");
		}
	}
);




/**
* @method - POST
* @param - /login
* @description - User Login
*/

// endpoint path
router.post("/login", 
	// set rule while login
	[
		body("email", "Please enter a valid email").isEmail(),
		body("password", "Password must be at least 5 characters").isLength({ min: 5 })
	],

	// callback function
	async (req, res) => {
		// check if error or not
		const errors =validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		// deconstruct
		const { email, password } = req.body;

		try {
			// find email user if exist
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({
					message: "User Not Exist"
				});
			}

			// encrypt password and check if match or not
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res.status(400).json({
					message: "Incorrect Password!"
				});

			// set payload
			const payload = { 
				user: { 
					id: user.id 
				}
			};

			// create jwt token if payload not empty
			jwt.sign(
				payload,
				"randomString", // token key
				{ expiresIn: 6000 },
				(err, token) => {
					if (err) throw err;
					// give token when success
					res.status(200).json({
						token
					});
				}
			);
		} catch (err) {
			// error when login
			console.log(err);
			res.status(500).json({
				message: "Server Error"
			});
		}
	}
)




/**
* @method - GET
* @param - /profile
* @description - Get LoggedIn User
* need token for headers
*/

// endpoint path and do auth before do a callback function
router.get("/profile", auth, async (req, res) => {
	try {
		// find user by id
		const user = await User.findById(req.user.id);
		// show user profile
		res.json(user.email);
	} catch (e) {
		// error while fetching
		res.send({ message: "Error in Fetching user "});
	}
});




/**
* @method - PATCH
* @param - /profile
* @description - Update User Profile
* need token for headers
*/

router.patch("/profile/update", 
	auth, // set middleware
	async (req, res) => {
	try {
		// find user by id
		const user = await User.findById(req.user.id);

		let validated = false;

		// deconstruct
		const { username, email, password } = req.body;

		// checke what's changes from data
		if (username != null) {
			user.username = username;
			validated = true;
		}
		if (email != null) {
			user.email = email;
		}
		if (password != null) {
			user.password = password;
		}

		const userUpdated = await user.save();
		res.json(userUpdated);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ message: "Error while updating" });
	}
})




/**
* @method - DELETE
* @param - /profile
* @description - Delete User Account
* need token for headers
*/

router.delete("/profile/delete", 
	// set middleware
	auth, 
	// callback function
	async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		await user.remove();
		res.json({ message: "Delete account successfull" });
	} catch (err) {
		console.log(err.message);
		res.status(500).json({ message: "Failed to delete user" })
	}
})

module.exports = router;








