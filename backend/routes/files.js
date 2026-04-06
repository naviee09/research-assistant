const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const UploadedFile = require('../models/UploadedFile');
const { processPDF } = require('../utils/fileProcessor');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOCX, TXT files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  }
});

// Upload files
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const { userId } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const uploadedFiles = [];
    
    for (const file of files) {
      // Process the file content
      let content = '';
      if (file.mimetype === 'application/pdf') {
        content = await processPDF(file.path);
      } else {
        content = fs.readFileSync(file.path, 'utf8');
      }
      
      const uploadedFile = new UploadedFile({
        originalName: file.originalname,
        fileName: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
        content: content,
        userId: userId
      });
      
      await uploadedFile.save();
      uploadedFiles.push(uploadedFile);
    }
    
    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all files for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const files = await UploadedFile.find({ userId }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;