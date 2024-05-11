// Define a Mongoose schema for User
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamps: {
    type: Date,
    default: Date.now
  }
});

// Create a pre-save hook to auto-increment the ID
userSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    const lastUser = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    if (lastUser) {
      this.id = lastUser.id + 1;
    } else {
      this.id = 1; // If no users exist yet, start with 1
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('services', userSchema);
