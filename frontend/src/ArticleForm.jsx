// frontend/src/ArticleForm.jsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is imported

const ArticleForm = ({ backendUrl, editingArticle, onSuccess, onCancel }) => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('Fintech'); // Default category
    const [imageUrl, setImageUrl] = useState('');
    const [publishedAt, setPublishedAt] = useState(''); // Date string
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingArticle) {
            setTitle(editingArticle.title || '');
            setSummary(editingArticle.summary || '');
            setBody(editingArticle.body || '');
            setAuthor(editingArticle.author || '');
            setCategory(editingArticle.category || 'Fintech');
            setImageUrl(editingArticle.imageUrl || '');
            // Format date for input type="date"
            setPublishedAt(editingArticle.publishedAt ? new Date(editingArticle.publishedAt).toISOString().split('T')[0] : '');
        } else {
            // Reset form for new article
            setTitle('');
            setSummary('');
            setBody('');
            setAuthor('');
            setCategory('Fintech');
            setImageUrl('');
            setPublishedAt(new Date().toISOString().split('T')[0]); // Default to today's date
        }
    }, [editingArticle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const articleData = {
            title, summary, body, author, category, imageUrl,
            publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()
        };

        let url = '';
        let method = '';

        if (editingArticle) {
            url = `${backendUrl}/api/admin/articles/${editingArticle.id}`;
            method = 'PUT';
        } else {
            url = `${backendUrl}/api/admin/articles`;
            method = 'POST';
            articleData.id = uuidv4(); // Generate ID only for new articles
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(articleData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Article ${editingArticle ? 'updated' : 'added'} successfully!`);
            onSuccess(); // Callback to refresh article list
        } catch (err) {
            console.error(`Error ${editingArticle ? 'updating' : 'adding'} article:`, err);
            setError(err.message);
            alert(`Failed to ${editingArticle ? 'update' : 'add'} article: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    rows="3"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>
            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows="6"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="Fintech">Fintech</option>
                    <option value="Economy">Economy</option>
                    <option value="Startups">Startups</option>
                    <option value="Investments">Investments</option>
                    <option value="ESG">ESG</option>
                </select>
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input
                    type="date"
                    id="publishedAt"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div className="flex justify-end space-x-3">
                {editingArticle && (
                    <button
                        type="button" // Important for cancel button
                        onClick={onCancel}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                    >
                        Cancel Edit
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : (editingArticle ? 'Update Article' : 'Add Article')}
                </button>
            </div>
        </form>
    );
};

export default ArticleForm;