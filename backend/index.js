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

// backend/index.js

// ... (existing imports and setup)

// --- API Endpoints ---

// Root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Finshots Clone Backend API!');
});

// API endpoint to get articles, with optional category, search term, AND pagination
app.get('/api/articles', async (req, res) => {
  // ... (existing code for fetching articles with pagination)
});

// API endpoint to get a single article by ID
app.get('/api/articles/:id', async (req, res) => {
  // ... (existing code for fetching single article)
});

// NEW: API endpoint to get ALL articles (for admin list) - No pagination needed here
app.get('/api/admin/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ publishedAt: -1 });
        res.json(articles);
    } catch (err) {
        console.error('Error fetching all articles for admin:', err);
        res.status(500).json({ message: 'Error fetching all articles', error: err.message });
    }
});

// NEW: API endpoint to add a new article
app.post('/api/admin/articles', async (req, res) => {
    try {
        const newArticle = new Article({
            // Generate a unique ID (e.g., timestamp + random or just a UUID library)
            // For simplicity, let's use a combination of timestamp and a small random number
            id: `<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.floor(Math.random() * 1000)}`,
            title: req.body.title,
            summary: req.body.summary,
            body: req.body.body,
            author: req.body.author,
            publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(), // Use provided date or current date
            category: req.body.category,
            imageUrl: req.body.imageUrl
        });
        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (err) {
        console.error('Error adding new article:', err);
        res.status(400).json({ message: 'Error adding article', error: err.message });
    }
});

// NEW: API endpoint to update an existing article by ID
app.put('/api/admin/articles/:id', async (req, res) => {
    try {
        const updatedArticle = await Article.findOneAndUpdate(
            { id: req.params.id }, // Find by our custom 'id' field
            req.body,
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );
        if (updatedArticle) {
            res.json(updatedArticle);
        } else {
            res.status(404).send('Article not found');
        }
    } catch (err) {
        console.error('Error updating article:', err);
        res.status(400).json({ message: 'Error updating article', error: err.message });
    }
});

// NEW: API endpoint to delete an article by ID
app.delete('/api/admin/articles/:id', async (req, res) => {
    try {
        const deletedArticle = await Article.findOneAndDelete({ id: req.params.id }); // Find and delete by custom 'id'
        if (deletedArticle) {
            res.status(200).json({ message: 'Article deleted successfully' });
        } else {
            res.status(404).send('Article not found');
        }
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).json({ message: 'Error deleting article', error: err.message });
    }
});

// API endpoint to seed the database (remains unchanged)
app.post('/api/seed-articles', async (req, res) => {
  // ... (existing code for seeding)
});

// Start the server
app.listen(port, () => {
  console.log(`Finshots Clone Backend listening at http://localhost:${port}`);
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

