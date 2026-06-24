const { Note } = require('../models');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR } = require('../utils/uploader');

// =========================
// GET: All notes for user
// =========================
exports.listNotes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const notes = await Note.findAll({ where: { userId } });
    return res.json(notes);
  } catch (err) {
    console.error("listNotes ERR:", err);
    return res.status(500).json({ message: "Server error while fetching notes" });
  }
};

// =========================
// GET: Single note by ID
// =========================
exports.getNoteById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const note = await Note.findOne({ where: { id, userId } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    return res.json(note);
  } catch (err) {
    console.error("getNoteById ERR:", err);
    return res.status(500).json({ message: "Server error while fetching note" });
  }
};

// =========================
// POST: Create note
// =========================
exports.createNote = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const note = await Note.create({ userId, title, content });
    return res.status(201).json(note);
  } catch (err) {
    console.error("createNote ERR:", err);
    return res.status(500).json({ message: "Server error while creating note" });
  }
};

// =========================
// PUT: Update note
// =========================
exports.updateNote = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, content, deleteFile } = req.body;

    const note = await Note.findOne({ where: { id, userId } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;

    // Handle file changes
    if (req.file) {
      // Delete old file if exists
      if (note.fileUrl) {
        const filename = note.fileUrl.replace('/uploads/', '');
        const filepath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filepath)) {
          fs.unlink(filepath, (err) => {
            if (err) console.error("Failed to delete old file on disk:", err);
          });
        }
      }
      note.fileName = req.file.originalname;
      note.fileUrl = `/uploads/${req.file.filename}`;
    } else if (deleteFile === 'true' || deleteFile === true) {
      // Delete file from disk
      if (note.fileUrl) {
        const filename = note.fileUrl.replace('/uploads/', '');
        const filepath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filepath)) {
          fs.unlink(filepath, (err) => {
            if (err) console.error("Failed to delete file on disk:", err);
          });
        }
      }
      note.fileName = null;
      note.fileUrl = null;
    }

    await note.save();

    return res.json(note);
  } catch (err) {
    console.error("updateNote ERR:", err);
    return res.status(500).json({ message: "Server error while updating note" });
  }
};

// =========================
// DELETE: note
// =========================
exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const note = await Note.findOne({ where: { id, userId } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Delete associated file on disk if exists
    if (note.fileUrl) {
      const filename = note.fileUrl.replace('/uploads/', '');
      const filepath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
          if (err) console.error("Failed to delete file on disk:", err);
        });
      }
    }

    await note.destroy();
    return res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("deleteNote ERR:", err);
    return res.status(500).json({ message: "Server error while deleting note" });
  }
};


exports.uploadFileToNote = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file type not allowed' });
    }

    const note = await Note.create({
      userId,
      title: req.body.title || 'Untitled Note',
      content: req.body.content || '',
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`
    });

    res.status(201).json(note);

  } catch (err) {
    console.error("uploadFileToNote ERR:", err);
    res.status(500).json({
      message: 'Upload failed'
    });
  }
};