const Product = require('../model/Product');

/* TODO {category and brand }*/
exports.fetchAllProducts = async (req, res) => {
    try {
        // Extracting data from the request body
        // Extracting data from the request body
        const { search, _sort, _order, _page, _limit, brand, category } = req.body;

        // Condition for filtering by category
        if (category) {
            condition.category = category;
        }

        // Condition for filtering by brand
        if (brand) {
            condition.brand = brand;
        }

        // Condition for filtering deleted products
        const condition = !req.query.admin ? { deleted: { $ne: true } } : {};

        // Condition for searching by title
        if (search) {
            condition.title = { $regex: new RegExp(search, 'i') };
        }

        // Condition for filtering by category
        if (req.body.category) {
            condition.category = req.body.category;
        }

        // Condition for filtering by brand
        if (brand) {
            condition.brand = brand;
        }

        // Sorting
        const sort = {};
        if (_sort && _order) {
            sort[_sort] = _order;
        }

        // Pagination
        const pageSize = parseInt(_limit) || 10;
        const page = parseInt(_page) || 1;
        const skip = (page - 1) * pageSize;

        // Fetch products based on conditions, apply sorting and pagination
        const query = Product.find(condition)
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        // Fetch total number of products for pagination
        const totalDocs = await Product.countDocuments(condition);

        // Execute the query
        const docs = await query.exec();

        // Send response with totalDocs included in the body
        res.status(200).json({ totalDocs, products: docs });
    } catch (err) {
        // Handle errors
        res.status(400).json(err);
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


