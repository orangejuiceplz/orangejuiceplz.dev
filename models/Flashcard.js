const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);