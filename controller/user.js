const { User } = require("../model/user");

exports.getUserById = async (req, res) => {
    const Id = req.params.id;
    try {
        const user = await User.findById(Id)
        res.status(201).json(user)
    } catch (err) {
        res.status(400).json({ msg: "user not found" })

    }
};

exports.updateUserAddress = async (req, res) => {
    const { _id: id } = req.user;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};


exports.removeAddress = async (req, res) => {
    const { _id: id } = req.user;

    console.log(req.body);
    try {
        const user = await User.findByIdAndUpdate(id, { addresses: req.body.addresses });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.uploadImage = async (req, res) => {
    const { _id: id } = req.user;
    const file = req.file.path;
    try {



        
        const user = await User.findByIdAndUpdate(id, { image: file });
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err,"==");
        res.status(400).json(err);
    }
};


exports.updateProfile = async (req, res) => {
    const { _id: id } = req.user;


    try {

        const user = await User.findByIdAndUpdate(id, req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};

