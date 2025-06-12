// backend/index.js

const express = require('express');
const cors = require('cors'); // Import the cors middleware
const articles = require('./data'); // Import our mock article data

const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
// For development, we'll allow all origins. In production, you'd restrict this.
app.use(cors());

// Define a basic route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Finshots Clone Backend API!');
});

// New API endpoint to get all articles
app.get('/api/articles', (req, res) => {
  res.json(articles); // Send the articles array as JSON response
});

// New API endpoint to get a single article by ID
app.get('/api/articles/:id', (req, res) => {
  const articleId = req.params.id; // Get the ID from the URL parameters
  const article = articles.find(a => a.id === articleId); // Find the article by ID

  if (article) {
    res.json(article); // Send the found article as JSON
  } else {
    res.status(404).send('Article not found'); // Send 404 if not found
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Finshots Clone Backend listening at http://localhost:${port}`);
});