const express = require('express');
const router = express.Router();
const Checkout = require('../models/checkout');
const verifyToken = require('../middleware/verifyToken');

// POST Create a new checkout entry
router.post('/post/checkout', verifyToken, async (req, res) => {
	try {
		const userId = req.userId;
		const recordDate = new Date();

		let { cartItems, summary, address, payment } = req.body;

		// Create a new checkout entry
		const newCheckout = await Checkout.create({
			userId,
			cartItems,
			recordDate,
			summary,
			address,
			payment,
		});

		res.status(201).json({
			message: 'Woohoo!',
			subMessage: 'Your order has been placed.',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// GET Request to Get a checkout entry
router.get('/get/checkout', verifyToken, async (req, res) => {
	try {
		const userId = req.userId;

		// Find the checkout entry for the user
		const checkouts = await Checkout.find({ userId });

		if (!checkouts) {
			return res
				.status(404)
				.json({ message: 'Looks like you have not yet made any purchase' });
		}

		res.json(checkouts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});
module.exports = router;
