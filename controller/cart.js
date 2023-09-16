const { Cart } = require("../model/cart");

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const cartItems = await Cart.find({ user: id }).populate('user').populate('product')
        res.status(200).json(cartItems)
    } catch (err) {
        res.status(400).json({ msg: "fetchCartByUser Err" })
    }
}

exports.addTOCart = async (req, res) => {

    const cart = await Cart.create({ ...req.body, quantity: parseInt(req.body.quantity) })
    try {
        const doc = await cart.save();
        res.status(201).json(doc)
    } catch (err) {
        res.status(400).json({ msg: "addToCart ERR", err })
    }
}

exports.deleteCart = async (req, res) => {
    const cart = await Cart.findByIdAndDelete(req.params.id)
    try {
        res.status(201).json(cart)
    } catch (err) {
        res.status(400).json({ msg: "delete single cart error" })
    }
}

exports.updateCart = async (req, res) => {
    const { id } = req.params
    const cart = await Cart.findByIdAndUpdate(id, { ...req.body })
    try {
        const doc = await cart.save();
        res.status(201).json(doc)
    } catch (err) {
        res.status(400).json({ id, data: req.body })
    }
}

exports.deleteAllCart = async (req, res) => {
    // const cart = await Cart.deleteMany({ user: req.params.id })
    // try {
    //     res.status(201).json(cart)
    // } catch (err) {
    //     res.status(400).json(err)
    // }
}



