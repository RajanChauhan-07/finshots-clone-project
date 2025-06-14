// frontend/src/App.jsx

import React, { useState, useEffect } from 'react'; // Import useState and useEffect hooks
import './App.css';

function App() {
  // 1. State to hold our articles
  const [articles, setArticles] = useState([]);
  // 2. State to handle loading status
  const [loading, setLoading] = useState(true);
  // 3. State to handle any errors
  const [error, setError] = useState(null);

  // 4. useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // IMPORTANT: Ensure your backend server is running on http://localhost:3000
        const response = await fetch('http://localhost:3000/api/articles');

        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        setArticles(data); // Update the articles state with fetched data
      } catch (err) {
        setError(err.message); // Set error state if something goes wrong
      } finally {
        setLoading(false); // Always set loading to false after fetch attempt
      }
    };

    fetchArticles(); // Call the async function
  }, []); // The empty dependency array [] means this effect runs once after the initial render

  // 5. Render logic based on loading/error states
  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Finshots Clone</h1>
        </header>
        <main>
          <p>Loading articles...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Finshots Clone</h1>
        </header>
        <main>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <p>Please ensure your backend server is running at http://localhost:3000</p>
        </main>
      </div>
    );
  }

  // 6. Display the articles once loaded
  return (
    <div className="App">
      <header className="App-header">
        <h1>Finshots Clone</h1>
        <p className="subtitle">Daily financial news in 3 minutes</p>
      </header>
      <main className="articles-container">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <img src={article.imageUrl} alt={article.title} className="article-image" />
            <div className="article-content">
              <h2>{article.title}</h2>
              <p className="article-summary">{article.summary}</p>
              <p className="article-meta">
                {article.author} | {new Date(article.publishedAt).toLocaleDateString()} | {article.category}
              </p>
              {/* For MVP, we're just displaying summary. Full article link later */}
              {/* <a href="#">Read More</a> */}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;