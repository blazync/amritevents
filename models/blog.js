const mongoose = require('mongoose');

// Define the schema for the blog
const blogSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
      },
    imageUrl: {
        type: String,
        required: true
      },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
// Create a pre-save hook to auto-increment the ID
blogSchema.pre('save', async function (next) {
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

// Create a model from the schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
