const express = require("express");
const router = express.Router();
const Checkout = require("../models/checkout");
const verifyToken = require("../middleware/verifyToken");

// POST Create a new checkout entry
router.post("/post/checkout", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    let { cartItems, summary, address, payment } = req.body;
    // const newAddress = [address];

    // Create a new checkout entry
    const newCheckout = await Checkout.create({
      userId,
      cartItems,
      summary,
      address,
      payment,
    });

    // console.log(address);
    // console.log(newAddress);

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET Get a specific checkout entry by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the checkout entry by ID
    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.userId !== req.userId) {
      return res.status(401).json({ message: "User does not exist" });
    }

    res.json(checkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
