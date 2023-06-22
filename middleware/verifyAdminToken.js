const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const verifyAdminToken = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    // Retrieve the user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    // Set the user object in the request for further use
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = verifyAdminToken;
