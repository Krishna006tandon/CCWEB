const Class = require('../models/Class');

exports.createClass = async (req, res) => {
  try {
    const { title, description, price, duration, chefName } = req.body;
    let image = '';
    
    if (req.file) {
      image = req.file.path;
    } else if (req.body.image) {
      image = req.body.image;
    }

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newClass = await Class.create({
      title,
      description,
      price,
      duration,
      chefName,
      image
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find({});
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, chefName } = req.body;
    
    let image = req.body.image;
    if (req.file) {
      image = req.file.path;
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { title, description, price, duration, chefName, ...(image && { image }) },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
