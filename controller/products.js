const Product = require('../model/Product');




exports.fetchAllProducts = async (req, res) => {
    let condition = {}

    if (!req.query.admin) {
        condition.deleted = { $ne: true }
    }

    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        condition.title = { $regex: searchRegex };
    }


    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition);


    if (req.query.category) {
        query = query.find({ category: { $in: req.query.category } });
        totalProductsQuery = totalProductsQuery.find({
            category: { $in: req.query.category },
        });
    }
    if (req.query.brand) {
        query = query.find({ brand: { $in: req.query.brand } });
        totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand } });
    }
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductsQuery.count().exec();

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    } catch (err) {
        res.status(400).json(err);
    }
};



exports.createProduct = async (req, res) => {
    // this product we have to get from API body
    const product = await Product(req.body);
    // product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100))
    try {
        //const doc = await product.save()
        res.status(201).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
};

exports.fetchProductById = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    try {
        res.status(201).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
        product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100))
        const updatedProduct = await product.save()
        res.status(200).json(updatedProduct);


    } catch (err) {
        res.status(400).json(err);
    }
}

exports.deletedProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id)
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json(err);
    }
}








