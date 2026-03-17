const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    let image = '';
    
    if (req.file) {
      image = req.file.path;
    } else if (req.body.image) {
      image = req.body.image;
    }

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      image
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    
    let image = req.body.image;
    if (req.file) {
      image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, ...(image && { image }) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
