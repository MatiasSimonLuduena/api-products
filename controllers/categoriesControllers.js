import Category from "../models/categoriesModel.js";

export const addCategory = async (req, res) => {
    try {
        const { name, images } = req.body;

        // Verifica si ya existe en la base de datos
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ error: 'La categoría ya existe en la base de datos' });
        }

        // Errores
        if (!name) {
            return res.status(400).json({ error: 'El nombre no está definido' });
        }
        if (!images.length) {
            return res.status(400).json({ error: 'La o las imagenes no están definidas' });
        }

        const newCategory = new Category({ name, images });

        // Guarda el producto en la base de datos
        const savedCategory = await newCategory.save();
    
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Busca el la categoría por su ID
        const category = await Category.findById(categoryId);

        // Verifica si se puede eliminar
        if (category.protect !== undefined && category.protect === true) {
            return res.status(403).json({ error: 'No se permite eliminar esta categoría' });
        }

        // Busca por su ID y lo elimina
        const deletedCategory = await Category.findByIdAndRemove(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(deletedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updateData = req.body;

        // Busca  por su ID
        const category = await Category.findById(categoryId);

        // Verifica si se puede modificar
        if (category.protect !== undefined && category.protect === true) {
            return res.status(403).json({ error: 'No se permite modificar esta categoría' });
        }

        // Asegura que la propiedad 'protect' no se modifique en los datos de actualización
        if (updateData.protect !== undefined) {
            return res.status(404).json({ error: 'No se puede modificar la propiedad protect' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
}