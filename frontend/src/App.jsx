// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Router, Routes, Route, Link
import ArticleDetail from './ArticleDetail'; // Import the new ArticleDetail component
import './App.css'; // Main styling for App components
import './ArticleDetail.css'; // New styling for ArticleDetail (we'll create this next)


function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/articles');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  if (error) {
    return (
      <>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <p>Please ensure your backend server is running at http://localhost:3000</p>
      </>
    );
  }

  return (
    <main className="articles-container">
      {articles.map(article => (
        <Link to={`/articles/${article.id}`} key={article.id} className="article-card-link"> {/* Wrap card in Link */}
          <div className="article-card">
            <img src={article.imageUrl} alt={article.title} className="article-image" />
            <div className="article-content">
              <h2>{article.title}</h2>
              <p className="article-summary">{article.summary}</p>
              <p className="article-meta">
                {article.author} | {new Date(article.publishedAt).toLocaleDateString()} | {article.category}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}

function App() {
  return (
    <Router> {/* Wrap the entire app in Router */}
      <div className="App">
        <header className="App-header">
          <h1>Finshots Clone</h1>
          <p className="subtitle">Daily financial news in 3 minutes</p>
        </header>

        <Routes> {/* Define our routes */}
          <Route path="/" element={<ArticleList />} /> {/* Home page for article list */}
          <Route path="/articles/:id" element={<ArticleDetail />} /> {/* Route for individual article */}
          {/* Optional: Fallback for 404 */}
          <Route path="*" element={<main><p>Page not found</p></main>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;