const express = require("express");
const app = express();
const path = require("path");
const { storage, cloudinary } = require("./cloudinary");
const multer = require("multer");
// Local storage
// const uploads = multer({ dest: "uploads/" });
// Cloudinary storage
const uploads = multer({ storage });
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Image = require("./models/image");
//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//
mongoose
  .connect("mongodb://127.0.0.1:27017/imageDB")
  .then(() => console.log("connected to DB"))
  .catch(() => console.log("ERROR!"));
//
app.get("/", async (req, res) => {
  const allVehicles = await Image.find();
  res.render("display", { allVehicles });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", uploads.single("image"), async (req, res) => {
  // uploads.single("image") -> Expects single image under image:
  // req.file
  // uploads.array("image") -> Expects array of images under image:
  // req.files
  const newCar = new Image(req.body);
  newCar.image.url = req.file.path;
  newCar.image.filename = req.file.filename;
  await newCar.save();
  // console.log(req.body, req.file);
  console.log(newCar);
  res.redirect("/");
});

app.delete("/file/:id", async (req, res) => {
  const { id } = req.params;
  const file = await Image.findById(id);
  await cloudinary.uploader.destroy(file.image.filename);
  await Image.findByIdAndDelete(id);
  res.redirect("/");
});

app.listen(4000, () => console.log("We are live at 4000!"));
