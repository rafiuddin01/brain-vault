const express = require('express');
const router = express.Router();
const { upload } = require('../utils/uploader');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  listNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  uploadFileToNote
} = require('../controllers/notesController');

router.get('/', requireAuth, listNotes);
router.get('/:id', requireAuth, getNoteById);
router.post('/', requireAuth, createNote);
router.put('/:id', requireAuth, upload.single('file'), updateNote);
router.delete('/:id', requireAuth, deleteNote);

// upload single file while creating note
router.post('/upload', requireAuth, upload.single('file'), uploadFileToNote);

// or attach to existing create: router.post('/', requireAuth, upload.single('file'), createNote);


module.exports = router;
