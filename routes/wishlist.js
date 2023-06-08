const router = require("express").Router();
const Wishlist = require("../models/wishlist");
const User = require("../models/user");
const Product = require("../models/product");
const verifyToken = require("../middleware/verifyToken");

router.post("/wishlist/toggle", verifyToken, async (req, res) => {
  const { product } = req.body;
  const productId = product._id;
  const userId = req.userId;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // If the wishlist doesn't exist, create a new one
      wishlist = new Wishlist({
        userId,
        products: [],
      });
    }

    // Check if the product already exists in the wishlist
    const existingProduct = wishlist.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      // If the product already exists, remove it from the wishlist
      wishlist.products = wishlist.products.filter(
        (item) => item.product.toString() !== productId
      );
      await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist" });
    } else {
      // If the product doesn't exist, add it to the wishlist
      const productDetails = await Product.findById(productId);
      if (!productDetails) {
        return res.status(404).json({ message: "Product not found" });
      }

      const newProduct = {
        product: productDetails._id,
        category: productDetails.category,
        description: productDetails.description,
        discountedPrice: productDetails.discountedPrice,
        displaySection: productDetails.displaySection,
        gender: productDetails.gender,
        image: productDetails.image,
        name: productDetails.name,
        originalPrice: productDetails.originalPrice,
        quantity: productDetails.quantity,
        recordDate: productDetails.recordDate,
      };

      wishlist.products.push(newProduct);
      await wishlist.save();
      res.status(200).json({ message: "Product added to wishlist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
