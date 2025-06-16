// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import './App.css';
import './ArticleDetail.css';
import { formatDistanceToNow, parseISO } from 'date-fns';

// NEW: Article Skeleton Component
const ArticleSkeleton = () => (
  <div className="article-card skeleton-card">
    <div className="skeleton-image"></div>
    <div className="article-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-summary"></div>
      <div className="skeleton-summary short"></div>
      <div className="skeleton-meta"></div>
    </div>
  </div>
);

// Component for listing articles with filtering, search, and pagination
function ArticleList({ activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const categories = ['All', 'Economy', 'Startups', 'Fintech', 'Investments', 'ESG'];

  // Effect 1: Sync localSearchTerm with prop.searchTerm when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Effect 2: Debounce logic for updating the parent searchTerm state
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, setSearchTerm]);

  // Effect 3: Fetch articles based on activeCategory, searchTerm, and pagination
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true); // Set loading to true when fetch starts
        setError(null);

        const urlParams = new URLSearchParams();
        if (activeCategory) {
          urlParams.append('category', activeCategory);
        }
        if (searchTerm) {
          urlParams.append('searchTerm', searchTerm);
        }
        urlParams.append('page', currentPage);
        urlParams.append('limit', 3); // Keeping limit at 3 for easier testing of pagination

        const url = `https://finshots-clone-project.onrender.com/api/articles?${urlParams.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setArticles(prevArticles => {
            if (currentPage === 1) {
                return data.articles;
            } else {
                return [...prevArticles, ...data.articles];
            }
        });
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalArticles(data.totalArticles);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false when fetch finishes
      }
    };

    fetchArticles();
  }, [activeCategory, searchTerm, currentPage]);


  const handleSearchInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
    setCurrentPage(1);
    setArticles([]); // Clear articles immediately to show fresh search results
  };

  const handleCategoryClick = (category) => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setActiveCategory(category === 'All' ? null : category);
    setCurrentPage(1);
    setArticles([]); // Clear articles immediately for new category
  };

  const handleReadMoreClick = () => {
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

  // Determine what to render based on loading state and articles found
  const shouldShowNoArticlesMessage = !loading && articles.length === 0 && (activeCategory || searchTerm);
  const shouldShowSkeletons = loading && articles.length === 0;

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
        {shouldShowNoArticlesMessage && (
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

        {shouldShowSkeletons && (
          <>
            {Array.from({ length: 3 }).map((_, index) => ( // Render 3 skeleton cards
              <ArticleSkeleton key={index} />
            ))}
          </>
        )}
      </div>

      {/* "Read More" Button */}
      {currentPage < totalPages && !shouldShowSkeletons && ( // Hide button if skeletons are showing
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