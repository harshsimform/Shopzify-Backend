require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(cors());

const productsRouter = require("./routes/products");
app.use("/product", productsRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.listen(3000, () => console.log("Server Started"));
