const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });

// Add connection error handling
userSchema.pre('find', function() {
  console.log('Executing User find operation');
});

userSchema.post('find', function() {
  console.log('User find operation completed');
});

module.exports = mongoose.model('User', userSchema);