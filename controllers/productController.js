const { Product, Category } = require('../models');
const path = require('path');
const fs = require('fs');

// Crear un nuevo producto con imagen
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;

  try {
    // Verificar si la categoría existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    let imageUrl = null;

    // Verificar si se subió un archivo de imagen
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Crear el nuevo producto
    const newProducto = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId, // Relación con la categoría
      imageUrl,
    });

    res.status(201).json(newProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const productos = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['name'] // Solo traer el nombre de la categoría
      }]
    });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Product.findByPk(id, {
      include: [{
        model: Category,
        attributes: ['name'] // Incluir solo el nombre de la categoría
      }]
    });
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
};

// Actualizar un producto con imagen
exports.updateProducto = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId } = req.body;

  try {
    const producto = await Product.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      producto.categoryId = categoryId;
    }

    let imageUrl = producto.imageUrl;

    // Verificar si se subió una nueva imagen
    if (req.file) {
      // Eliminar la imagen anterior si existe
      if (producto.imageUrl) {
        const previousImagePath = path.join(__dirname, '..', 'uploads', path.basename(producto.imageUrl));
        if (fs.existsSync(previousImagePath)) {
          fs.unlinkSync(previousImagePath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    producto.name = name || producto.name;
    producto.description = description || producto.description;
    producto.price = price || producto.price;
    producto.stock = stock || producto.stock;
    producto.imageUrl = imageUrl;

    await producto.save();
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Eliminar un producto y su imagen asociada
exports.deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Product.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar la imagen del servidor
    if (producto.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(producto.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await producto.destroy();
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
};
