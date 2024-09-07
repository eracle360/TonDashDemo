const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  appStore: {
    type: String,
  },
  googlePlay: {
    type: String,
  },
  github: {
    type: String,
  },
  website: {
    type: String,
  },
  telegram: {
    type: String,
  },
  socialMedia: {
    type: String,
  },
  icon: {
    type: String,
    required: true,
  },
  screenshots: {
    type: [String],
    required: true,
  },
  video: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'promoted', 'deleted'],
    default: 'pending',
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create text indexes on fields to enable text search
appSchema.index({
  appName: 'text',
  caption: 'text',
  description: 'text',
  languages: 'text',
});

const App = mongoose.model('App', appSchema);
module.exports = App;
