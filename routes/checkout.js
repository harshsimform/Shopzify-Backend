const express = require("express");
const router = express.Router();
const Checkout = require("../models/checkout");
const verifyToken = require("../middleware/verifyToken");

// POST Create a new checkout entry
router.post("/post/checkout", verifyToken, async (req, res) => {
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
      message: "Woohoo!",
      subMessage: "Your order has been placed.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET Request to Get a checkout entry for user
router.get("/get/checkout", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Find the checkout entry for the user
    const checkouts = await Checkout.find({ userId });

    if (!checkouts) {
      return res
        .status(404)
        .json({ message: "Looks like you have not yet made any purchase" });
    }

    res.json(checkouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET Request to Get all checkout records (accessible only by admin)
router.get("/admin/checkouts", async (req, res) => {
  try {
    // Find all checkout records
    const adminCheckouts = await Checkout.find();

    if (!adminCheckouts) {
      return res.status(404).json({ message: "No checkout records found" });
    }

    res.json(adminCheckouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT Request to Update the status of a product in a checkout entry
router.patch("/admin/checkout/:checkoutId/status", async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { stepIndex } = req.body;

    // Find the checkout entry by ID
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout entry not found" });
    }

    // Update the status based on the step index
    checkout.updateStatus(stepIndex);

    // Save the updated checkout entry
    await checkout.save();

    res.json({ message: "Checkout status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET Request to Get the order details by ID
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Checkout.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
