const { Brand } = require("../model/brands");
exports.fetchAllBrand = async (req, res, next) => {
    const brands = await Brand.find()
    res.status(200).json({ success: true, msg: brands })
}
