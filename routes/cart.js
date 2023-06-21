const router = require("express").Router();
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");
const verifyToken = require("../middleware/verifyToken");

// Add product to cart
router.post("/post/cart", verifyToken, async (req, res) => {
  const { product } = req.body;
  const userId = req.userId;

  let productId;
  if (product.productId) {
    productId = product.productId;
  } else {
    productId = product._id;
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new Cart({
        userId,
        products: [],
      });
    }

    // Check if the product already exists in the cart
    const existingProduct =
      cart &&
      cart.products.find((item) => item.productId.toString() === productId);

    if (existingProduct) {
      return res.status(200).json({ message: "Product already added to cart" });
    }

    // If the product doesn't exist, add it to the cart
    const productDetails = await Product.findById(productId);
    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newProduct = {
      productId: productDetails._id,
      category: productDetails.category,
      description: productDetails.description,
      discountedPrice: productDetails.discountedPrice,
      gender: productDetails.gender,
      image: productDetails.image,
      name: productDetails.name,
      originalPrice: productDetails.originalPrice,
    };

    cart.products.push(newProduct);
    await cart.save();
    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Remove product from cart
router.post("/remove/cart", verifyToken, async (req, res) => {
  const { product } = req.body;
  const userId = req.userId;

  let productId;
  if (product.productId) {
    productId = product.productId;
  } else {
    productId = product._id;
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the product exists in the cart
    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingProduct) {
      return res.status(200).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Remove all products from the cart
router.put("/delete/cart", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove all products from the cart
    cart.products = [];

    await cart.save();
    res.status(200).json({ message: "All products removed from cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET endpoint to fetch the cart
router.get("/carts", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("products");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
