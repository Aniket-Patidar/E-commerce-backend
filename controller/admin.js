const { Brand } = require("../model/brands");
const { Order } = require("../model/order");
const { User } = require("../model/user");
const { Categories } = require("../model/categories");
const cloudinary = require('cloudinary').v2;
const path = require('path');


cloudinary.config({
    cloud_name: 'draw7t9sz',
    api_key: '329576791485659',
    api_secret: 'D3aHlPjygJhdbC6eozUCRpXD5CQ'
});

const Product = require('../model/Product');

exports.createProduct = async (req, res) => {
    const product = await Product(req.body);
    await product.save();
    try {
        if (req.files && req.files.thumbnail) {
            const file = req.files.thumbnail;
            const modifiedName = `ecommerce-${Date.now()}${path.extname(file.name)}`;

            const filepath = req.files.thumbnail;
            const ProductThumbnail = await cloudinary.uploader.upload(filepath.tempFilePath, {
                folder: "products",
            });
            product.thumbnail = {
                fileId: ProductThumbnail.public_id,
                url: ProductThumbnail.secure_url
            };
        }

        // Upload multiple images to Cloudinary if provided
        if (req.files && req.files.images) {
            const images = req.files.images;
            const imageUrls = [];
            for (const image of images) {
                const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "products"
                });
                imageUrls.push({
                    fileId: uploadedImage.public_id,
                    url: uploadedImage.secure_url
                });
            }
            product.images = imageUrls;
        }

        // Save the product to the database
        await product.save();

        await product.save();
        res.status(201).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
};

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        let product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, msg: "Product not found" });
        }

        // Delete old thumbnail image from Cloudinary if a new thumbnail is provided
        if (req.files && req.files.thumbnail) {
            const oldThumbnailFileId = product.thumbnail.fileId;
            if (oldThumbnailFileId) {
                await cloudinary.uploader.destroy(oldThumbnailFileId);
            }

            const thumbnailFile = req.files.thumbnail;
            const thumbnail = await cloudinary.uploader.upload(thumbnailFile.tempFilePath, {
                folder: "products"
            });
            product.thumbnail = {
                fileId: thumbnail.public_id,
                url: thumbnail.secure_url
            };
        }

        // Delete old images from Cloudinary if new images are provided
        if (req.files && req.files.images) {
            const oldImageFileIds = product.images.map(image => image.fileId);
            for (const fileId of oldImageFileIds) {
                await cloudinary.uploader.destroy(fileId);
            }

            const images = req.files.images;
            const imageUrls = [];
            for (const image of images) {
                const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "products"
                });
                imageUrls.push({
                    fileId: uploadedImage.public_id,
                    url: uploadedImage.secure_url
                });
            }
            product.images = imageUrls;
        }

        // Update text fields
        product.set(req.body);

        // Calculate and update discount price
        product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));

        // Save the updated product to the database
        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.deletedProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id)
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json(err);
    }
}


/* Order Create and update */
exports.getALLOderTOAdmin = async (req, res) => {

    let query = Order.find({});
    let totalOrdersQuery = Order.find({});
    const totalDocs = await totalOrdersQuery.count().exec();
    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }
    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    } catch (err) {
        res.status(400).json(err);
    }


};

exports.updateOrder = async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
        return res.status(400).json({ msg: "order not found" })
    }
    try {
        res.status(200).json(order)
    }
    catch (err) {
        res.status(400).json({ msg: "order update fails" })
    }
}


/* Brand  Category */
exports.CreateBrand = async (req, res, next) => {
    try {
        const { label, value } = req.body;
        const existingBrand = await Brand.findOne({ $or: [{ label }, { value }] });

        if (!label || !value) {
            return res.status(400).json({ success: false, msg: "please enter lable and value" });
        }

        if (existingBrand) {
            return res.status(400).json({ success: false, msg: "Brand with the same label or value already exists" });
        }
        const newBrand = new Brand({
            label,
            value
        });
        await newBrand.save();
        res.status(201).json({ success: true, msg: "Brand created successfully", brand: newBrand });
    } catch (error) {
        console.error("Error creating brand:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.id;

        const brand = await Brand.findByIdAndDelete(brandId);
        if (!brand) {
            return res.status(404).json({ success: false, msg: "Brand not found" });
        }


        res.status(200).json({ success: true, msg: "Brand deleted successfully" });
    } catch (error) {
        console.error("Error deleting brand:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
}



/* Category */
exports.createCategory = async (req, res, next) => {
    try {
        const { label, value } = req.body;

        if (!label || !value) {
            return res.status(400).json({ success: false, msg: "please enter lable and value" });
        }

        const existingCategory = await Categories.findOne({ $or: [{ label }, { value }] });

        if (existingCategory) {
            return res.status(400).json({ success: false, msg: "Category with the same label or value already exists" });
        }

        const newCategory = new Categories({
            label,
            value
        });

        // Save the new category to the database
        await newCategory.save();

        res.status(201).json({ success: true, msg: "Category created successfully", category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Categories.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, msg: "Category not found" });
        }


        res.status(200).json({ success: true, msg: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


/* all users */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, msg: "No users found" });
        }

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};