import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    },
    images: {
        type: [String], required: false
    },
    protect: {
        type: Boolean, required: false, default: false
    }
});

const Category = mongoose.model('category', categorySchema);

export default Category;