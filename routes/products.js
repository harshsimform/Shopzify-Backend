const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Getting all
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);
  try {
    const products = await Product.find().limit(limit);
    const allData = {
      productDetails: products,
    };
    res.json(allData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

// Search Products by category name
router.get("/category/:key", async (req, res) => {
  let data = await Product.find({
    $or: [{ category: { $regex: req.params.key } }],
  });
  res.send(data);
});

// Search Product by name, description and category,
router.get("/search/:key", async (req, res) => {
  const searchKey = req.params.key.replace(/\s/g, "\\s");
  const regex = new RegExp(searchKey, "i");

  const data = await Product.find({
    $or: [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
      { category: { $regex: regex } },
    ],
  });

  res.send(data);
});

// Creating one
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      image: req.body.image,
      name: req.body.name,
      discountedPrice: req.body.discountedPrice,
      originalPrice: req.body.originalPrice,
      description: req.body.description,
      quantity: req.body.quantity,
      gender: req.body.gender,
      category: req.body.category,
      displaySection: req.body.displaySection,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getProduct, async (req, res) => {
  try {
    Object.assign(res.product, req.body);
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.deleteOne();
    res.json({ message: "Deleted Product" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.product = product;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
