require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./model/dbConnect');
var bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require('path');
const errorMiddleware = require('./middleware/errorMiddelWare');
const AdminAuthenticateToken = require('./middleware/isAdmin');

connectDB()

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(cookieParser());




const fileupload = require('express-fileupload');
app.use(fileupload({
	useTempFiles: true
}));


app.use("/auth", require("./router/auth"))
app.use("/users", require("./router/user"))
app.use("/products", require("./router/products"))
app.use("/brands", require("./router/brands"))
app.use("/categories", require("./router/categories"))
app.use("/cart", require("./router/cart"))
app.use("/orders", require("./router/order"))
app.use("/admin", AdminAuthenticateToken, require("./router/admin"))
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Not Found"
  })
});
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("server run", process.env.PORT);
})