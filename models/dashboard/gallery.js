const mongoose = require('mongoose');
const { Schema } = mongoose;

const gallerySchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  filetype: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  uploadedByEmail: {
    type: String,
    required: true
  },
  size: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
