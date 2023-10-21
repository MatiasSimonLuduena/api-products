import Products from "../models/productsModel.js";

// get
export const allProducts = async (req, res) => {
    try {
        const allProducts = await Products.find({});
        res.json(allProducts);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const oneProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto por _id:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const filterProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, name, category, minPrice, maxPrice } = req.query;
        const skip = (page - 1) * limit;
        const filters = {};

        if (name) {
            filters.title = new RegExp(name, 'i');
        }
        if (category) {
            filters.category = { $regex: `^${category}$`, $options: 'i' };
        }
        if (minPrice && maxPrice) {
            filters.price = {
                $gte: minPrice,
                $lte: maxPrice
            };
        } else if (minPrice) {
            filters.price = {
                $gte: minPrice
            };
        } else if (maxPrice) {
            filters.price = {
                $lte: maxPrice
            };
        }

        const totalProducts = await Products.countDocuments(filters);
        const totalPages = Math.ceil(totalProducts / limit);

        const filteredProducts = await Products.find(filters)
            .skip(skip)
            .limit(limit);

        res.json({
            products: filteredProducts,
            page,
            totalPages,
            totalProducts
        });
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// post
export const addProduct = async (req, res) => {
    try {
        const { title, price, description, category, image, protect } = req.body;

        // Verifica si el título ya existe en la base de datos
        const existingProduct = await Products.findOne({ title });

        if (existingProduct) {
            return res.status(400).json({ error: 'El título del producto ya existe en la base de datos' });
        }

        // Maneja errores específicos para cada propiedad
        if (!title) {
            return res.status(400).json({ error: 'El título no está definido' });
        }
        if (!price) {
            return res.status(400).json({ error: 'El precio no está definido' });
        }
        if (!description) {
            return res.status(400).json({ error: 'La descripción no está definida' });
        }
        if (!category) {
            return res.status(400).json({ error: 'La categoría no está definida' });
        }
        if (!image) {
            return res.status(400).json({ error: 'La imagen no está definida' });
        }

        // Verifica si el precio está en el rango válido (mayor a 1 y menor a 10.000)
        if (price <= 1 || price >= 10000) {
            return res.status(400).json({ error: 'El precio debe estar entre 1 y 10.000' });
        }
    
        // Crea una nueva instancia del modelo Product con los datos proporcionados
        const newProduct = new Products({
          title, price, description, category, image, protect
        });
    
        // Guarda el producto en la base de datos
        const savedProduct = await newProduct.save();
    
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

// delete
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Busca el producto por su ID
        const product = await Products.findById(productId);

        // Verifica si el producto se puede eliminar
        if (product.protect !== undefined && product.protect === true) {
            return res.status(403).json({ error: 'No se permite eliminar este producto' });
        }
    
        // Busca el producto por su ID y lo elimina
        const deletedProduct = await Products.findByIdAndRemove(productId);
    
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

// put
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        // Busca el producto por su ID
        const product = await Products.findById(productId);

        // Verifica si el producto se puede modificar
        if (product.protect !== undefined && product.protect === true) {
            return res.status(403).json({ error: 'No se permite modificar este producto' });
        }

        // Asegura que la propiedad 'protect' no se modifique en los datos de actualización
        if (updateData.protect !== undefined) {
            return res.status(404).json({ error: 'No se puede modificar la propiedad protect' });
        }

        // Verifica si el precio es menor a 0 o mayor a 10000
        if (updateData.price !== undefined && (updateData.price < 1 || updateData.price > 10000)) {
            return res.status(400).json({ error: 'El precio debe estar entre 0 y 10000' });
        }
    
        const updatedProduct = await Products.findByIdAndUpdate(productId, updateData, { new: true });
    
        if (!updatedProduct) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}