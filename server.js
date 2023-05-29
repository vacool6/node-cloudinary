const express = require("express");
const app = express();
const path = require("path");
const { storage } = require("./cloudinary");
const multer = require("multer");
// Local storage
// const uploads = multer({ dest: "uploads/" });
// Cloudinary storage
const uploads = multer({ storage });

//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
//
app.get("/", (req, res) => {
  res.render("display");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", uploads.single("image"), (req, res) => {
  // uploads.single("image") -> Expects single image under image:
  // req.file
  // uploads.array("image") -> Expects array of images under image:
  // req.files
  console.log(req.body, req.file);
  res.redirect("/");
});

app.listen(4000, () => console.log("We are live at 4000!"));
