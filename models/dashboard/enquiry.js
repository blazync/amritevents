// Define a Mongoose schema for User
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  services: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  Preferredday: {
    type: String,
    default: null
  },
  Preferredtime: {
    type: String,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  timestamps: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('enquiry', userSchema);
