// frontend/src/ArticleDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

function ArticleDetail({ backendUrl }) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${backendUrl}/api/articles/${id}`);
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
  }, [id, backendUrl]);

  if (loading) {
    return <div className="text-center py-10">Loading article...</div>;
  }

  if (error) {
    return <div className="text-center py-10" style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!article) {
    return <div className="text-center py-10">Article not found.</div>;
  }
  
  const formattedDate = format(parseISO(article.publishedAt), 'dd MMMM yyyy').toUpperCase();

  return (
    <div className="bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="text-blue-600 hover:underline mb-8 block">&larr; Back to all articles</Link>
        
        <div className="text-center mb-8">
            <p className="text-sm text-gray-500 font-semibold tracking-wider">
                <span>{formattedDate}</span>
                <span className="mx-2">•</span>
                <span>{article.category.toUpperCase()}</span>
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 font-sans">{article.title}</h1>
        </div>

        <img src={article.imageUrl} alt={article.title} className="w-full h-auto rounded-lg shadow-md mb-8" />
        
        <div 
          className="prose prose-lg max-w-none mx-auto article-body"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </div>
    </div>
  );
}

export default ArticleDetail;