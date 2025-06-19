// frontend/src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import ArticleForm from './ArticleForm'; // Assuming ArticleForm is a separate component

const AdminPanel = ({ backendUrl }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null); // State to hold article being edited

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${backendUrl}/api/admin/articles`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setArticles(data);
        } catch (err) {
            console.error("Error fetching admin articles:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [backendUrl]); // Refetch when backendUrl changes (though it's constant)

    const handleSuccess = () => {
        setEditingArticle(null); // Clear editing state after success
        fetchArticles(); // Refresh the list of articles
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        // Scroll to the form section if needed
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this article?")) {
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/api/admin/articles/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Filter out the deleted article from the local state
            setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
            alert('Article deleted successfully!');
        } catch (err) {
            console.error('Error deleting article:', err);
            setError(err.message);
            alert(`Failed to delete article: ${err.message}`);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen"> {/* Overall container */}
            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10 pt-4">Admin Panel</h2>

            {/* Add New Article Section */}
            <div className="bg-white p-8 rounded-lg shadow-xl mb-12 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h3>
                <ArticleForm
                    backendUrl={backendUrl}
                    editingArticle={editingArticle}
                    onSuccess={handleSuccess}
                    onCancel={() => setEditingArticle(null)} // Added cancel button for editing
                />
            </div>

            {/* Manage Articles Section */}
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manage Articles</h3>

                {loading && (
                    <div className="text-center text-indigo-600 text-lg">
                        <p>Loading articles...</p>
                    </div>
                )}
                {error && <div className="text-red-600 text-center text-lg">Error: {error}</div>}

                {!loading && !error && articles.length === 0 && (
                    <p className="text-center text-gray-500">No articles found. Add some above!</p>
                )}

                {!loading && !error && articles.length > 0 && (
                    <div className="overflow-x-auto"> {/* Enable horizontal scrolling for small screens */}
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Title</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Published Date</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900 truncate max-w-xs">{article.id}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800">{article.title}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{article.category}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{new Date(article.publishedAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="text-indigo-600 hover:text-indigo-900 font-semibold mr-3 px-3 py-1 rounded-md border border-indigo-600 hover:border-indigo-900 transition duration-150"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="text-red-600 hover:text-red-900 font-semibold px-3 py-1 rounded-md border border-red-600 hover:border-red-900 transition duration-150"
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
        </div>
    );
};

export default AdminPanel;