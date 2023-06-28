const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			productId: {
				type: String,
				required: true,
			},
			category: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
			discountedPrice: {
				type: Number,
				required: true,
			},
			gender: {
				type: String,
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
			originalPrice: {
				type: Number,
				required: true,
			},
			cartQty: {
				type: Number,
				required: true,
				default: 1,
			},
		},
	],
});

module.exports = mongoose.model('Cart', cartSchema);
