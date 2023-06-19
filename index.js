require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
// app.use(cors());

app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'http://localhost:5174',
			'https://temp-shopzify-admin.onrender.com/',
		],
		credentials: true,
	})
);
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header(
		'Access-Control-Allow-Origin',
		'http://localhost:5173',
		'http://localhost:5174'
	);
	if (req.headers['access-control-request-private-network']) {
		res.header('Access-Control-Allow-Private-Network', 'true');
	}
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');

	next();
});

const productsRouter = require('./routes/products');
app.use('/product', productsRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const wishlistRouter = require('./routes/wishlist');
app.use('/user-wishlist', wishlistRouter);

const cartRouter = require('./routes/cart');
app.use('/user-cart', cartRouter);

const addressRouter = require('./routes/address');
app.use('/user-address', addressRouter);

app.listen(3000, () => console.log('Server Started'));
