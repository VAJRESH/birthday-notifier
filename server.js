const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// environment variables
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.set("port", port);

// middle wares and parser
app.use(cors());
app.use(express.json());

// database connection
const uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb connection successful");
});

// user details routes
const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);

// auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// routes for crud actions
const addBirthdays = require("./routes/birthday.routes");
app.use("/birthday", addBirthdays);

// serving default image
app.use("/images", express.static(path.join(__dirname, "images")));

const publicPath = path.join(__dirname, "front-end", "build");
app.use(express.static(publicPath));

// serving frontend files
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, function () {
  console.log(`Server up and running on port ${port}`);
});
