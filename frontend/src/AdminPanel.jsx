// frontend/src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import ArticleForm from './ArticleForm'; // Assuming ArticleForm is a separate component

const AdminPanel = ({ backendUrl }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null); // State to hold article being edited
    const [isFormOpen, setIsFormOpen] = useState(false);

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

    const handleAddNew = () => {
        setEditingArticle(null);
        setIsFormOpen(true);
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingArticle(null);
    };

    const handleSuccess = () => {
        handleCloseForm();
        fetchArticles();
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
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Articles</h1>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        + Add New Article
                    </button>
                </header>

                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleCloseForm}></div>
                )}
                <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isFormOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <ArticleForm
                        backendUrl={backendUrl}
                        editingArticle={editingArticle}
                        onSuccess={handleSuccess}
                        onCancel={handleCloseForm}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    {loading && <p className="text-center text-gray-500 py-4">Loading articles...</p>}
                    {error && <p className="text-center text-red-600 py-4">Error: {error}</p>}
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{article.title}</div>
                                            <div className="text-xs text-gray-500 truncate">ID: {article.id}</div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{article.category}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{new Date(article.publishedAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && !error && articles.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No articles found. Add one!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;