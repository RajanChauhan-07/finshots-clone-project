// backend/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose
require('dotenv').config(); // Load environment variables from .env file

const articlesData = require('./data'); // Our mock data, for seeding only

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable parsing JSON request bodies (for future use like adding articles)

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI; // Get URI from environment variables

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Article Schema and Model
const articleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping 'id' for consistency with frontend
  title: String,
  summary: String,
  body: String,
  author: String,
  publishedAt: Date,
  category: String,
  imageUrl: String
});

const Article = mongoose.model('Article', articleSchema); // Create the Article Model

// --- API Endpoints ---

// Root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Finshots Clone Backend API!');
});

// API endpoint to get all articles, with optional category filtering
app.get('/api/articles', async (req, res) => {
  const category = req.query.category;
  let query = {}; // Start with an empty query

  if (category) {
    // If category is provided, add it to the query (case-insensitive regex for flexibility)
    query.category = { $regex: new RegExp(category, 'i') };
  }

  try {
    const articles = await Article.find(query).sort({ publishedAt: -1 }); // Find articles and sort by newest first
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Error fetching articles', error: err.message });
  }
});

// API endpoint to get a single article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findOne({ id: req.params.id }); // Find by our custom 'id' field
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

// NEW: API endpoint to seed the database with initial articles
app.post('/api/seed-articles', async (req, res) => {
  try {
    // Clear existing articles to prevent duplicates on re-seeding
    await Article.deleteMany({});
    // Insert new articles from our mock data
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