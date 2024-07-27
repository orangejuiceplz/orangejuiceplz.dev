const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});

app.get('/skills', (req, res) => {
  res.render('skills', { title: 'Skills' });
});

app.get('/blog', (req, res) => {
  res.render('blog', { title: 'Blog' });
});

app.get('/stats', (req, res) => {
  res.render('stats', { title: 'GitHub Stats' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});