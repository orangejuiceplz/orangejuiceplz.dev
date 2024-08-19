const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// get all flashcards for the user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.user._id });
    res.render('flashcards/index', { flashcards });
  } catch (error) {
    res.status(500).render('error', { message: 'Error fetching flashcards' });
  }
});

// render create flashcard form
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('flashcards/create');
});

// create new flashcard
router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { front, back, category } = req.body;
    const newFlashcard = new Flashcard({
      front,
      back,
      category,
      user: req.user._id
    });
    await newFlashcard.save();
    res.redirect('/flashcards');
  } catch (error) {
    res.status(500).render('error', { message: 'Error creating flashcard' });
  }
});

// render edit flashcard form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
    if (!flashcard) {
      return res.status(404).render('error', { message: 'Flashcard not found' });
    }
    res.render('flashcards/edit', { flashcard });
  } catch (error) {
    res.status(500).render('error', { message: 'Error fetching flashcard' });
  }
});

// update a  flashcard
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { front, back, category } = req.body;
    await Flashcard.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { front, back, category }
    );
    res.redirect('/flashcards');
  } catch (error) {
    res.status(500).render('error', { message: 'Error updating flashcard' });
  }
});

// delete a flashcard
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.redirect('/flashcards');
  } catch (error) {
    res.status(500).render('error', { message: 'Error deleting flashcard' });
  }
});

// make study page
router.get('/study', ensureAuthenticated, async (req, res) => {
    try {
      const flashcards = await Flashcard.find({ user: req.user._id });
      res.render('flashcards/study', { flashcards });
    } catch (error) {
      res.status(500).render('error', { message: 'Error fetching flashcards for study' });
    }
  });

module.exports = router;