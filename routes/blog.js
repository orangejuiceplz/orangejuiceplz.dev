const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Blog index
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('blog/index', { posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).render('error', { message: 'Error fetching posts' });
  }
});

// Single post
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).render('error', { message: 'Post not found' });
    }
    res.render('blog/post', { post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).render('error', { message: 'Error fetching post' });
  }
});

// Admin dashboard
router.get('/admin', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { posts });
  } catch (error) {
    console.error('Error fetching posts for admin:', error);
    res.status(500).render('error', { message: 'Error fetching posts' });
  }
});

// Create post form
router.get('/admin/create', (req, res) => {
  res.render('admin/create');
});

// Create post action
router.post('/admin/create', async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.create({ title, content });
    res.redirect('/blog/admin');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).render('error', { message: 'Error creating post' });
  }
});

// Edit post form
router.get('/admin/edit/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).render('error', { message: 'Post not found' });
    }
    res.render('admin/edit', { post });
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    res.status(500).render('error', { message: 'Error fetching post' });
  }
});

// Edit post action
router.post('/admin/edit/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content, updatedAt: Date.now() });
    res.redirect('/blog/admin');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).render('error', { message: 'Error updating post' });
  }
});

// Delete post
router.post('/admin/delete/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/blog/admin');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).render('error', { message: 'Error deleting post' });
  }
});

module.exports = router;