// backend/index.js

const express = require('express');
const cors = require('cors');
const articles = require('./data'); // Our mock article data

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the Finshots Clone Backend API!');
});

// New API endpoint to get all articles, now with optional category filtering
app.get('/api/articles', (req, res) => {
  const category = req.query.category; // Get the 'category' from query parameters (e.g., /api/articles?category=Economy)

  if (category) {
    // If a category is provided, filter the articles
    const filteredArticles = articles.filter(article =>
      article.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredArticles);
  } else {
    // If no category is provided, send all articles
    res.json(articles);
  }
});

// API endpoint to get a single article by ID (remains unchanged)
app.get('/api/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const article = articles.find(a => a.id === articleId);

  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Finshots Clone Backend listening at http://localhost:${port}`);
});