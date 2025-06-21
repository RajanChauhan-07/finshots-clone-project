import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import ArchiveFilter from './ArchiveFilter';

const ArchivePage = ({ backendUrl }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({ year: null, month: null });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page,
          limit: 12,
        });

        if (filter.year && filter.month) {
          params.append('year', filter.year);
          params.append('month', filter.month);
        }

        const url = `${backendUrl}/api/articles?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, filter, backendUrl]);

  const handleFilterChange = (newFilter) => {
    setPage(1); // Reset to first page when filter changes
    setFilter(newFilter);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Finshots Archive</h1>
        <p className="text-lg text-gray-600 mt-2">3 Min reads that are fun, insightful and easy to understand.</p>
      </div>

      <ArchiveFilter backendUrl={backendUrl} onFilterChange={handleFilterChange} />

      {loading ? (
        <p>Loading articles...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="flex justify-between items-center mt-12">
            {page > 1 && (
              <button onClick={() => setPage(p => p - 1)} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                &larr; Newer Posts
              </button>
            )}
            <div className="text-center flex-grow">
              <span className="text-gray-600">Page {page} of {totalPages}</span>
            </div>
            {page < totalPages && (
              <button onClick={() => setPage(p => p + 1)} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                Older Posts &rarr;
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArchivePage; 