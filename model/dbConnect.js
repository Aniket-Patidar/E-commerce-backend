const mongoose = require('mongoose')

exports.connectDB = async () => {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
        console.log("db connected");
    } catch (error) {
        console.log(error);
    }
}