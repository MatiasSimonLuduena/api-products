import express from 'express';
const routes = express.Router();

import {
    allProducts, oneProduct, filterProducts, addProduct, deleteProduct, updateProduct
} from "../controllers/productsControllers.js"

routes.get("/all", allProducts);

routes.get("/one/:id", oneProduct);

routes.get("/filter", filterProducts);

routes.post("/add", addProduct);

routes.delete("/delete/:id", deleteProduct);

routes.put("/update/:id", updateProduct);

export default routes;