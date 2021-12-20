require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(process.env.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use("/", require("./routes/index"));
app.use("/api", require("./routes/api"));

app.listen(process.env.port, () => {
    console.log(`Server started on port ${process.env.port}`);
});