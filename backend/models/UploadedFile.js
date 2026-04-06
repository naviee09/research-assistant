const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  content: {
    type: String
  },
  processedContent: {
    type: String
  },
  userId: {
    type: String, // Changed from ObjectId to String to match the test data
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
uploadedFileSchema.index({ userId: 1 });
uploadedFileSchema.index({ uploadedAt: -1 });

// Add connection error handling
uploadedFileSchema.pre('find', function() {
  console.log('Executing UploadedFile find operation');
});

uploadedFileSchema.post('find', function() {
  console.log('UploadedFile find operation completed');
});

module.exports = mongoose.model('UploadedFile', uploadedFileSchema);