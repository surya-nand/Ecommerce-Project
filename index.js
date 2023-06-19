const express = require("express");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const Product = mongoose.model("Product", {
  title: String,
  price: Number,
  image: String,
  rating: Object,
});

dotEnv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.json({
    msg: "All good",
  });
});

app.post("/api/products", async (req, res) => {
  try {
    const { title, price, image, rating } = req.body;
    const product = await new Product({ title, price, image, rating });
    product
      .save()
      .then((new_product_details) => {
        res.send({
          msg: "New product details added",
          details: new_product_details,
        });
      })
      .catch((error4) => {
        res.send({
          msg: "New product details failed to add",
        });
      });
  } catch (error3) {
    res.json({
      status: "Fail",
      message: error3,
    });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: "Success",
      data: products,
    });
  } catch (error4) {
    res.json({
      status: "Fail",
      msg: error4,
    });
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error2) => {
      console.log("DB connection failed", error2);
    });
  console.log(`Server is running on ${process.env.port}`);
});
