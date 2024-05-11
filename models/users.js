const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  Status: String,
  password: String,
  timestamps: { type: Date, default: Date.now }
});

// Register the model
const User = mongoose.model('users', userSchema);

// Initialize function to create a default user
userSchema.statics.initDefaultUser = async function() {
  const existingUser = await User.findOne({ email: 'blazync@gmail.com' });
  if (!existingUser) {
    await User.create({
      name: 'Blazync Admin',
      email: 'blazync@gmail.com',
      role: '1',
      password: '$2b$10$4h48dofqijHQ2FD2dYTcleihSm86vwCneNcyplDhNf1CP9l8yfG3e' // You should replace this with an encrypted password
    });
  }
};

// Call the initDefaultUser function when the model is initialized
userSchema.statics.initDefaultUser();

module.exports = User;
