// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import './App.css';
import './ArticleDetail.css';
import { formatDistanceToNow, parseISO } from 'date-fns'; // Add this import

// Component for listing articles with filtering, search, and pagination
function ArticleList({ activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  // New states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const categories = ['All', 'Economy', 'Startups', 'Fintech', 'Investments', 'ESG'];

  // Effect 1: Sync localSearchTerm with prop.searchTerm when prop changes (e.g., from back navigation or category click)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Effect 2: Debounce logic for updating the parent searchTerm state
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300); // 300ms debounce delay
    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, setSearchTerm]);


  // Effect 3: Fetch articles based on activeCategory, searchTerm, and pagination
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const urlParams = new URLSearchParams();
        if (activeCategory) {
          urlParams.append('category', activeCategory);
        }
        if (searchTerm) {
          urlParams.append('searchTerm', searchTerm);
        }
        urlParams.append('page', currentPage); // Add page number to request
        urlParams.append('limit', 3); // Fixed limit for articles per page

        const url = `http://localhost:3000/api/articles?${urlParams.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Backend now returns an object with articles, currentPage, totalPages, totalArticles
        // Append new articles if loading more, otherwise replace (for category/search changes)
        setArticles(prevArticles => {
            if (currentPage === 1) {
                return data.articles; // Replace articles if it's the first page
            } else {
                return [...prevArticles, ...data.articles]; // Append if loading subsequent pages
            }
        });
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalArticles(data.totalArticles);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // If currentPage is greater than 1, only fetch if not already loading.
    // If currentPage is 1, fetch whenever filters/search changes.
    fetchArticles();
  }, [activeCategory, searchTerm, currentPage]); // Effect depends on these states


  const handleSearchInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
    // Always reset to page 1 when search term changes
    setCurrentPage(1);
    setArticles([]); // Clear articles immediately to show fresh search results
  };

  const handleCategoryClick = (category) => {
    setLocalSearchTerm(''); // Clear local search input
    setSearchTerm(''); // Clear parent's debounced search term
    setActiveCategory(category === 'All' ? null : category);
    // Always reset to page 1 when category changes
    setCurrentPage(1);
    setArticles([]); // Clear articles immediately for new category
  };

  const handleReadMoreClick = () => {
    // Only load next page if not already on the last page
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


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
      {/* Search Input Field */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search articles by title or summary..."
          className="search-input"
          value={localSearchTerm}
          onChange={handleSearchInputChange}
        />
      </div>

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
        {articles.length === 0 && !loading && ( // Only show message if no articles AND not loading
          <p className="no-articles-message">No articles found for this filter.</p>
        )}
        {articles.map(article => (
          <Link to={`/articles/${article.id}`} key={article.id} className="article-card-link">
            <div className="article-card">
              <img src={article.imageUrl} alt={article.title} className="article-image" />
              <div className="article-content">
                <h2>{article.title}</h2>
                <p className="article-summary">{article.summary}</p>
                <p className="article-meta">
                    {article.author} | {formatDistanceToNow(parseISO(article.publishedAt), { addSuffix: true })} | {article.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {loading && articles.length === 0 && <p>Loading initial articles...</p>} {/* Initial load message */}
      </div>

      {/* "Read More" Button */}
      {currentPage < totalPages && (
        <div className="read-more-container">
          <button
            className="read-more-button"
            onClick={handleReadMoreClick}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Loading More...' : 'Read More'}
          </button>
        </div>
      )}
      {/* Optional: Displaying pagination info */}
      {/* {totalArticles > 0 && <p>Showing {articles.length} of {totalArticles} articles</p>} */}

    </main>
  );
}

// Main App component with Routing
function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Finshots Clone</h1>
          <p className="subtitle">Daily financial news in 3 minutes</p>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <ArticleList
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
          <Route path="/articles/:id" element={<ArticleDetail activeCategory={activeCategory} searchTerm={searchTerm} />} />
          <Route path="*" element={<main><p>Page not found</p></main>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;