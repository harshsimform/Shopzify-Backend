const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	recordDate: {
		type: Date,
		required: true,
	},
	cartItems: [
		{
			discountedPrice: {
				type: Number,
				required: true,
			},
			image: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			productId: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	summary: [
		{
			totalMrp: {
				type: Number,
				required: true,
			},
			taxCharge: {
				type: Number,
				required: true,
			},
			shippingCharge: {
				type: Number,
				required: true,
			},
			totalAmount: {
				type: Number,
				required: true,
			},
		},
	],
	address: [
		{
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
			address: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
			state: {
				type: String,
				required: true,
			},
			postalCode: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
		},
	],
	payment: [
		{
			cardName: {
				type: String,
				required: true,
			},
			cardNumber: {
				type: String,
				required: true,
			},
			expirationDate: {
				type: String,
				required: true,
			},
			cvv: {
				type: String,
				required: true,
			},
		},
	],
});

module.exports = mongoose.model('Checkout', checkoutSchema);
