// frontend/src/App.jsx

import React, { useState, useEffect } from 'react'; // Removed useCallback, not strictly needed for this pattern
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import './App.css';
import './ArticleDetail.css';


// Component for listing articles with filtering and search
function ArticleList({ activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Local state for the search input value, allowing immediate feedback
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const categories = ['All', 'Economy', 'Startups', 'Fintech', 'Investments', 'ESG'];

  // Effect 1: Sync localSearchTerm with prop.searchTerm when prop changes (e.g., from back navigation or category click)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);


  // Effect 2: This is the debouncing logic for the actual API call
  useEffect(() => {
    // Set up a timer to update the parent's searchTerm state after a delay
    const handler = setTimeout(() => {
      setSearchTerm(localSearchTerm); // Update the parent's searchTerm prop
    }, 300); // 300ms debounce delay

    // Cleanup function: Clear the previous timeout if localSearchTerm changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, setSearchTerm]); // This effect runs when localSearchTerm or setSearchTerm changes


  // Effect 3: Fetch articles based on activeCategory and the (debounced) searchTerm prop
  // This is separated to ensure API call only happens when the *debounced* term is ready
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const urlParams = new URLSearchParams();
        if (activeCategory) {
          urlParams.append('category', activeCategory);
        }
        if (searchTerm) { // Use the prop searchTerm for the API call
          urlParams.append('searchTerm', searchTerm);
        }

        const url = `http://localhost:3000/api/articles?${urlParams.toString()}`;

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

    // Trigger fetch only when activeCategory or the debounced searchTerm changes
    fetchArticles();
  }, [activeCategory, searchTerm]);


  // Handler for the input field: updates local state immediately
  const handleSearchInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
  };


  const handleCategoryClick = (category) => {
    // When category changes, clear search term in both local and parent states
    setLocalSearchTerm('');
    setSearchTerm('');
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
      {/* Search Input Field */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search articles by title or summary..."
          className="search-input"
          value={localSearchTerm} // Bind to local state for immediate feedback
          onChange={handleSearchInputChange} // Update local state on change
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
        {articles.length === 0 && !loading && !error && (
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
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // This is the state that triggers API calls

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
                searchTerm={searchTerm} // This searchTerm is used for fetching
                setSearchTerm={setSearchTerm} // This updates the fetching searchTerm
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