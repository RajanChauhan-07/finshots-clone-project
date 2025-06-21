import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { Link } from 'react-router-dom';

function Home({ backendUrl }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${backendUrl}/api/articles?limit=4`; // Fetch 4 articles

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data.articles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [backendUrl]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p style={{ color: 'red' }}>Error: {error}</p>
        <p>Please ensure your backend server is running at {backendUrl}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Finshots Daily</h2>
        <Link to="/archive" className="text-blue-600 hover:underline">View All →</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* You can add skeleton loaders here if you want */}
            <p>Loading articles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home; 