import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const ArticleCard = ({ article }) => {
  const formattedDate = format(parseISO(article.publishedAt), 'MMM d, yyyy');

  return (
    <Link to={`/articles/${article.id}`} className="block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative">
        <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors duration-300">{article.title}</h3>
        <p className="text-gray-700 text-base">{article.summary}</p>
      </div>
    </Link>
  );
};

export default ArticleCard; 