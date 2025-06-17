// frontend/src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import ArticleForm from './ArticleForm'; // We'll create this next

const AdminPanel = ({ backendUrl }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null); // State to hold article being edited

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch ALL articles for admin, not just paginated ones
            const response = await fetch(`${backendUrl}/api/admin/articles`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setArticles(data);
        } catch (err) {
            console.error("Error fetching admin articles:", err);
            setError(`Failed to fetch articles: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [backendUrl]); // Re-fetch if backendUrl changes (though it shouldn't once deployed)

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete article with ID: ${id}?`)) {
            return;
        }
        try {
            const response = await fetch(`<span class="math-inline">\{backendUrl\}/api/admin/articles/</span>{id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new new Error(`HTTP error! status: ${response.status}`);
            }
            // If successful, remove from local state
            setArticles(articles.filter(article => article.id !== id));
            alert('Article deleted successfully!');
        } catch (err) {
            console.error("Error deleting article:", err);
            alert(`Failed to delete article: ${err.message}`);
        }
    };

    const handleEdit = (article) => {
        setEditingArticle(article); // Set the article to be edited
    };

    const handleArticleFormSubmit = () => {
        setEditingArticle(null); // Clear editing state after submission
        fetchArticles(); // Re-fetch articles to show latest data
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h1>

            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">{editingArticle ? 'Edit Article' : 'Add New Article'}</h2>
                <ArticleForm
                    backendUrl={backendUrl}
                    editingArticle={editingArticle}
                    onSuccess={handleArticleFormSubmit}
                />
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage Articles</h2>
            {loading && <p className="text-center text-gray-600">Loading articles...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && !error && articles.length === 0 && (
                <p className="text-center text-gray-600">No articles found in the database. Add one above!</p>
            )}
            {!loading && !error && articles.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;