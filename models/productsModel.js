import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {
        type: String, required: true, unique: true
    },
    price: {
        type: Number, required: true
    },
    description: {
        type: String, required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'category'
    },
    image: {
        type: String, required: true
    },
    protect: {
        type: Boolean, required: false, default: false
    }
});

const Products = mongoose.model('products', productsSchema);

export default Products;