const mongoose = require('mongoose');

const researchReportSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  keyTakeaways: [{
    type: String,
    required: true
  }],
  sources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    description: {
      type: String
    },
    date: {
      type: Date
    },
    type: {
      type: String,
      enum: ['file', 'live'],
      required: true
    },
    sourceName: {
      type: String
    }
  }],
  usageCount: {
    type: Number,
    default: 1
  },
  creditsUsed: {
    type: Number,
    default: 1
  },
  freshness: {
    type: String,
    enum: ['fresh', 'stale'],
    default: 'fresh'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String, // Changed from ObjectId to String to match the test data
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
researchReportSchema.index({ userId: 1 });
researchReportSchema.index({ createdAt: -1 });
researchReportSchema.index({ question: 1 });

// Add connection error handling
researchReportSchema.pre('find', function() {
  console.log('Executing ResearchReport find operation');
});

researchReportSchema.post('find', function() {
  console.log('ResearchReport find operation completed');
});

module.exports = mongoose.model('ResearchReport', researchReportSchema);