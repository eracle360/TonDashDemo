const mongoose = require('mongoose');

const jettonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  supply: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Jetton = mongoose.model('Jetton', jettonSchema);
module.exports = Jetton;
