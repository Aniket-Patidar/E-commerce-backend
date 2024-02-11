require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./model/dbConnect');
var bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require('path');

connectDB()
app.use(cors({
    exposedHeaders: ['X-Total-Count']
}))






app.use(cors())

app.use(express.json());
app.use(bodyParser.urlencoded())

app.use(cookieParser());





app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/products", require("./router/products"))
app.use("/users", require("./router/user"))
app.use("/auth", require("./router/auth"))
app.use("/brands", require("./router/brands"))
app.use("/categories", require("./router/categories"))
app.use("/cart", require("./router/cart"))
app.use("/orders", require("./router/order"))
app.use("/admin", require("./router/admin"))

app.use("*", (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "Not Found"
    })
});


app.listen(8080, () => {
    console.log("server run");
})