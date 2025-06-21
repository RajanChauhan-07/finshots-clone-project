// backend/index.js

require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Keep this import
const mongoose = require('mongoose');
const { parseISO, format } = require('date-fns');

const articlesData = require('./data.js'); // Our mock data, for seeding only

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// --- START OF REQUIRED CORS CONFIGURATION CHANGE ---
// CORS configuration
const allowedOrigins = [
    'https://finshots-clone-project.vercel.app', // Your Vercel frontend URL
    'https://finshots-clone-project-git-main-rajan-chauhans-projects.vercel.app',
    'https://finshots-clone-project-qyz9xeh51-rajan-chauhans-projects.vercel.app',
    'http://localhost:5173', // For local frontend development
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or same-origin in development)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're sending cookies/auth headers later
    optionsSuccessStatus: 204 // For preflight requests
}));
// --- END OF REQUIRED CORS CONFIGURATION CHANGE ---


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

// Helper to get unique archive dates
const getArchiveDates = () => {
  const dates = articlesData.map(article => parseISO(article.publishedAt));
  const uniqueMonths = [...new Set(dates.map(date => format(date, 'yyyy-MM')))];
  return uniqueMonths.map(month => {
    const [year, monthNum] = month.split('-');
    return {
      year: parseInt(year),
      month: parseInt(monthNum),
      label: format(new Date(year, monthNum - 1), 'MMMM yyyy')
    };
  }).sort((a, b) => b.year - a.year || b.month - a.month);
};

// Helper to get the next sequential ID
const getNextId = () => {
  const maxId = articlesData
    .map(a => parseInt(a.id, 10)) // Convert IDs to numbers
    .filter(id => !isNaN(id)) // Filter out any non-numeric IDs
    .reduce((max, current) => Math.max(max, current), 0); // Find the max ID
  return (maxId + 1).toString(); // Return the next ID as a string
};

// Existing: API endpoint to get articles, with optional category, search term, AND pagination
app.get('/api/articles', async (req, res) => {
    let filteredArticles = [...articlesData];

    // Filtering logic
    const { category, searchTerm, year, month } = req.query;

    if (category) {
        filteredArticles = filteredArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (searchTerm) {
        filteredArticles = filteredArticles.filter(a =>
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.summary.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (year && month) {
        filteredArticles = filteredArticles.filter(a => {
            const articleDate = parseISO(a.publishedAt);
            return articleDate.getFullYear() === parseInt(year) && (articleDate.getMonth() + 1) === parseInt(month);
        });
    }

    // Sort by published date descending
    filteredArticles.sort((a, b) => parseISO(b.publishedAt) - parseISO(a.publishedAt));

    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Default to 12 for archive

    try {
        const totalArticles = filteredArticles.length;
        const totalPages = Math.ceil(totalArticles / limit);

        const paginatedArticles = filteredArticles.slice((page - 1) * limit, page * limit);

        res.json({
            articles: paginatedArticles,
            currentPage: page,
            totalPages,
            totalArticles
        });
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).json({ message: 'Error fetching articles', error: err.message });
    }
});

// Existing: API endpoint to get a single article by ID
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
app.post('/api/admin/articles', (req, res) => {
    const newArticle = {
        id: getNextId(),
        ...req.body,
        publishedAt: new Date().toISOString() // Ensure there's a published date
    };
    articlesData.unshift(newArticle);
    res.status(201).json(newArticle);
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
    try {
        await Article.deleteMany({});
        await Article.insertMany(articlesData);
        res.status(201).json({ message: 'Database seeded successfully with initial articles!' });
    } catch (err) {
        console.error('Error seeding database:', err);
        res.status(500).json({ message: 'Error seeding database', error: err.message });
    }
});

app.get('/api/articles/archive-dates', (req, res) => {
  try {
    const dates = getArchiveDates();
    res.json(dates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching archive dates', error: error.message });
  }
});

// Start the server (ONLY ONE app.listen() call at the very end)
app.listen(port, () => {
    console.log(`Finshots Clone Backend listening at http://localhost:${port}`);
});