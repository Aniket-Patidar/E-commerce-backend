
const { Order } = require('../model/order')
const Product = require('../model/Product');



exports.fetchOrdersByUser = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    try {
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.createOrder = async (req, res) => {
    console.log(req.body,"==");
    const order = await Order(req.body)
    const productsId = order.items;
    productsId.forEach(async (e) => {
        const product = await Product.findById(e.product.id);
        product.stock = product.stock - e.quantity;
        await product.save();
    })
    console.log(order);
    try {
        await order.save()
        res.status(201).json(order)
    } catch (err) {
        res.status(400).json({ msg: "create order failed" })
    }
}


