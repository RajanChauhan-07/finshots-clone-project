// frontend/src/ArticleDetail.jsx

import React, { useState, useEffect } from 'react';
// Import useLocation to determine the current path, though not strictly needed for this specific fix.
// We'll primarily use Link to construct the back URL.
import { useParams, Link } from 'react-router-dom';

// ArticleDetail now accepts activeCategory as a prop
function ArticleDetail({ activeCategory }) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true); // Ensure loading state is reset on ID change
        setError(null);   // Clear any previous errors

        const response = await fetch(`http://localhost:3000/api/articles/${id}`);
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
  }, [id]); // Re-run effect if ID changes

  // Construct the 'back to articles' path based on activeCategory
  const backPath = activeCategory ? `/?category=${activeCategory}` : '/';

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
      {/* Use the dynamically constructed backPath */}
      <Link to={backPath} className="back-link">&larr; Back to all articles</Link>
      <h1 className="article-detail-title">{article.title}</h1>
      <img src={article.imageUrl} alt={article.title} className="article-detail-image" />
      <p className="article-detail-meta">
        {article.author} | {new Date(article.publishedAt).toLocaleDateString()} | {article.category}
      </p>
      <div className="article-detail-body">
        <p>{article.body}</p>
      </div>
    </div>
  );
}

export default ArticleDetail;