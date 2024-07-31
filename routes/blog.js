const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Blog index
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.render('blog', { title: 'Blog', posts }); 
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).render('error', { title: 'Error', message: 'Error fetching posts' });
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
    res.render('admin/create', { title: 'Create Post', post: null }); 
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
router.get('/admin/edit/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).render('error', { title: 'Error', message: 'Post not found' });
      }
      res.render('admin/create', { title: 'Edit Post', post }); // Using the same template for create and edit
    } catch (error) {
      console.error('Error fetching post for edit:', error);
      res.status(500).render('error', { title: 'Error', message: 'Error fetching post' });
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