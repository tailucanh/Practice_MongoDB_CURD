const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const mongoose = require("mongoose");
const ProductModel = require("./productModal");
const uri =
  "mongodb+srv://LucAnhTai:Lucanhtai15@mydatabasemob402.emalwiw.mongodb.net/CP17303_DB?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  await mongoose.connect(uri);
  let arrProduct = await ProductModel.find().lean();
  res.render("products", { arrProduct });
});

app.post("/", async (req, res) => {
  const product = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    quantity: req.body.quantity,
    promotion: req.body.promotion,
  });
  try {
    await product.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Đã có lỗi xảy ra!");
  }
});
app.post("/delete-product/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.redirect("/");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.get("/get-product/:id", async (req, res) => {
  const productId = req.params.id;
  let product = await ProductModel.findById(productId);
  console.log(product);
  res.json(product);
});

app.post("/update-product/:id", async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  const product = await ProductModel.findById(productId);

  try {
    const updateProduct = await ProductModel.findOneAndUpdate(
      product,
      req.body,
      {
        new: true,
      }
    );
    if (!updateProduct) {
      return res.status(404).send({ error: "Product not found" });
    }
    console.log(updateProduct);
    res.redirect("/");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
