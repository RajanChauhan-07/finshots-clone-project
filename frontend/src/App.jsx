// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import './App.css';
import './ArticleDetail.css';


// Component for listing articles with filtering
// It now receives activeCategory and setActiveCategory as props
function ArticleList({ activeCategory, setActiveCategory }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define our static categories.
  const categories = ['All', 'Economy', 'Startups', 'Fintech', 'Investments', 'ESG'];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = activeCategory
          ? `http://localhost:3000/api/articles?category=${activeCategory}`
          : 'http://localhost:3000/api/articles';

        const response = await fetch(url);

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
  }, [activeCategory]); // Rerun this effect whenever activeCategory changes

  const handleCategoryClick = (category) => {
    setActiveCategory(category === 'All' ? null : category);
  };

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
    <main>
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`category-button ${activeCategory === category || (activeCategory === null && category === 'All') ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="articles-container">
        {articles.length === 0 && !loading && !error && (
          <p className="no-articles-message">No articles found for this category.</p>
        )}
        {articles.map(article => (
          <Link to={`/articles/${article.id}`} key={article.id} className="article-card-link">
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
      </div>
    </main>
  );
}

// Main App component with Routing
function App() {
  // Move activeCategory state up to the App component
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Finshots Clone</h1>
          <p className="subtitle">Daily financial news in 3 minutes</p>
        </header>

        <Routes>
          {/* Pass activeCategory and setActiveCategory as props to ArticleList */}
          <Route path="/" element={<ArticleList activeCategory={activeCategory} setActiveCategory={setActiveCategory} />} />
          {/* Pass activeCategory as a prop to ArticleDetail */}
          <Route path="/articles/:id" element={<ArticleDetail activeCategory={activeCategory} />} />
          <Route path="*" element={<main><p>Page not found</p></main>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;