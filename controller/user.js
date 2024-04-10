const { User } = require("../model/user");
const catchAsyncError = require("../middleware/catchAsynError.js");
const ErrorHandler = require("../utils/ErrorHandler.js.js");

exports.updateProfile = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== id) {
            throw new ErrorHandler("Email ID already in use", 400);
        }

        const user = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });

        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

exports.getUserById = catchAsyncError(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

exports.updateUserAddress = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    try {
        const user = await User.findByIdAndUpdate(id, { addresses: req.body }, { new: true });

        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

exports.removeAddress = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;
    try {
        const user = await User.findByIdAndUpdate(id, { addresses: req.body.addresses }, { new: true });
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.statusCode || 500).json({ msg: err.message || "Internal Server Error" });
    }
});

/* TODO : Cloudinary */
exports.uploadImage = catchAsyncError(async (req, res) => {
    const { _id: id } = req.user;

    const user = await User.findById(id).exec();

    if (req.files && req.files.avatar) {
        const file = req.files.avatar;
        const modifiedName = `ecommerce-${Date.now()}${path.extname(file.name)}`;

        if (user.avatar.fileId !== '') {
            await cloudinary.uploader.destroy(user.avatar.fileId, (error, result) => {
                if (error) {
                    console.error('Error deleting file from Cloudinary:', error);
                } else {
                    console.log('File deleted successfully:', result);
                }
            });
        }
        const filepath = req.files.avatar;
        const myavatar = await cloudinary.uploader.upload(filepath.tempFilePath, {
            folder: "avaters",
        });

        user.avatar = {
            fileId: myavatar.public_id,
            url: myavatar.secure_url
        };

        await user.save();
        return res
            .status(200)
            .json({ success: true, message: 'Profile Picture Updated Successfully!', user: user });
    } else {
        // Handle the case where req.files or req.files.resuma is undefined
        return next(new ErrorHandler("Find No Avatar"))
    }
});
