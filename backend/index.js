// backend/index.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const articlesData = require('./data'); // Our mock data, for seeding only

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Models ---

// Article Schema and Model
const articleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  summary: String,
  body: String,
  author: String,
  publishedAt: Date,
  category: String,
  imageUrl: String
});
const Article = mongoose.model('Article', articleSchema);

// --- API Endpoints ---

// Root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Finshots Clone Backend API!');
});

// API endpoint to get articles, with optional category, search term, AND pagination
app.get('/api/articles', async (req, res) => {
  const category = req.query.category;
  const searchTerm = req.query.searchTerm;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 3; // Default to 3 articles per page

  let query = {};

  if (category) {
    query.category = { $regex: new RegExp(category, 'i') };
  }

  if (searchTerm) {
    query.$or = [
      { title: { $regex: new RegExp(searchTerm, 'i') } },
      { summary: { $regex: new RegExp(searchTerm, 'i') } } 
    ];
  }

  try {
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit) // Skip articles for previous pages
      .limit(limit); // Limit the number of articles per page

    const totalArticles = await Article.countDocuments(query); // Total articles matching the query
    const totalPages = Math.ceil(totalArticles / limit);

    res.json({
      articles,
      currentPage: page,
      totalPages,
      totalArticles
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Error fetching articles', error: err.message });
  }
});

// API endpoint to get a single article by ID (remains unchanged)
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findOne({ id: req.params.id });
    if (article) {
      res.json(article);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (err) {
    console.error('Error fetching single article:', err);
    res.status(500).json({ message: 'Error fetching article', error: err.message });
  }
});

// API endpoint to seed the database with initial articles (remains unchanged)
app.post('/api/seed-articles', async (req, res) => {
  try {
    await Article.deleteMany({});
    await Article.insertMany(articlesData);
    res.status(201).json({ message: 'Database seeded successfully with initial articles!' });
  } catch (err) {
    console.error('Error seeding database:', err);
    res.status(500).json({ message: 'Error seeding database', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Finshots Clone Backend listening at http://localhost:${port}`);
});