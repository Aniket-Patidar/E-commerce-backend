const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({
    title: { type: String, required: true, /* unique: true  */ },
    description: { type: String, required: true },
    price: { type: Number, min: [1, 'wrong min price'], max: [10000, 'wrong max price'] },
    discountPercentage: { type: Number, min: [1, 'wrong min discount'], max: [99, 'wrong max discount'] },
    rating: { type: Number, min: [0, 'wrong min rating'], max: [5, 'wrong max price'], default: 0 },
    stock: { type: Number, min: [0, 'wrong min stock'], default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: {
        type: Object,
        default: {
            fileId: '',
            url: 'https://plus.unsplash.com/premium_photo-1699534403319-978d740f9297?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    images: {
        type: [{
            type: {
                fileId: { type: String, default: '' },
                url: { type: String, default: 'https://plus.unsplash.com/premium_photo-1699534403319-978d740f9297?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
            },
        }],
    },
    colors: { type: [Schema.Types.Mixed] },
    sizes: { type: [Schema.Types.Mixed] },
    highlights: { type: [String] },
    discountPrice: { type: Number },
    deleted: { type: Boolean, default: false },
})

const virtualId = productSchema.virtual('id');
virtualId.get(function () {
    return this._id;
})

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
})


const Product = mongoose.model('product', productSchema)
module.exports = Product;

