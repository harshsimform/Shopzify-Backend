const express = require('express');
const router = express.Router();
const Address = require('../models/address');
const verifyToken = require('../middleware/verifyToken');

router.post('/post/address', verifyToken, async (req, res) => {
	const {
		firstName,
		lastName,
		address,
		city,
		country,
		postalCode,
		email,
		phone,
	} = req.body;
	const userId = req.userId;

	try {
		const addressData = {
			firstName,
			lastName,
			address,
			city,
			country,
			postalCode,
			email,
			phone,
		};

		const userAddress = await Address.findOne({ userId });
		if (userAddress) {
			userAddress.addresses.push(addressData);
			await userAddress.save();
		} else {
			await Address.create({
				userId,
				addresses: [addressData],
			});
		}

		res.status(200).json({ message: 'Address stored successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong' });
	}
});

module.exports = router;
