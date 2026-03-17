const Note = require('../models/Note');

exports.uploadNote = async (req, res) => {
  try {
    const { title, description, classId } = req.body;
    let fileURL = '';
    
    if (req.file) {
      fileURL = req.file.path;
    } else if (req.body.fileURL) {
      fileURL = req.body.fileURL;
    }

    if (!fileURL) {
      return res.status(400).json({ message: 'File is required' });
    }

    const newNote = await Note.create({
      title,
      description,
      classId,
      fileURL
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotesByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const notes = await Note.find({ classId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
