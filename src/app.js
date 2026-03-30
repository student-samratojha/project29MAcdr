const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const secureRoutes = require("./routes/secure.routes");
const path = require("path");
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use("/auth", authRoutes);
app.use("/secure", secureRoutes);
app.use("/post", postRoutes);
app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;