// frontend/src/ArticleDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns'; // Add this import

function ArticleDetail({ activeCategory, searchTerm }) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://finshots-clone-project.onrender.com/api/articles/${id}`);
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
  }, [id]);

  // Construct the 'back to articles' path based on activeCategory AND searchTerm
  const backPathParams = new URLSearchParams();
  if (activeCategory) {
    backPathParams.append('category', activeCategory);
  }
  if (searchTerm) {
    backPathParams.append('searchTerm', searchTerm);
  }
  const finalBackPath = `/?${backPathParams.toString()}`;


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
      <Link to={finalBackPath} className="back-link">&larr; Back to all articles</Link>
      <h1 className="article-detail-title">{article.title}</h1>
      <img src={article.imageUrl} alt={article.title} className="article-detail-image" />
      <p className="article-detail-meta">
       {article.author} | {format(parseISO(article.publishedAt), 'MMMM dd, yyyy')} | {article.category}
      </p>
      <div className="article-detail-body">
        <p>{article.body}</p>
      </div>
    </div>
  );
}

export default ArticleDetail;