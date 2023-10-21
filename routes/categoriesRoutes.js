import express from 'express';
const routes = express.Router();

import {
    addCategory, deleteCategory, updateCategory
} from "../controllers/categoriesControllers.js";

routes.post("/add", addCategory);

routes.delete("/delete/:id", deleteCategory);

routes.put("/update/:id", updateCategory);

export default routes;