// frontend/src/ArticleDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link

function ArticleDetail() {
  const { id } = useParams(); // Get the 'id' from the URL parameters
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/articles/${id}`); // Fetch specific article by ID
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // Re-run effect if ID changes (important for navigation between articles)

  if (loading) {
    return <div className="article-detail-container">Loading article...</div>;
  }

  if (error) {
    return <div className="article-detail-container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!article) {
    return <div className="article-detail-container">Article not found.</div>;
  }

  return (
    <div className="article-detail-container">
      <Link to="/" className="back-link">&larr; Back to all articles</Link> {/* Back button */}
      <h1 className="article-detail-title">{article.title}</h1>
      <img src={article.imageUrl} alt={article.title} className="article-detail-image" />
      <p className="article-detail-meta">
        {article.author} | {new Date(article.publishedAt).toLocaleDateString()} | {article.category}
      </p>
      <div className="article-detail-body">
        <p>{article.body}</p> {/* Display the full body */}
      </div>
    </div>
  );
}

export default ArticleDetail;