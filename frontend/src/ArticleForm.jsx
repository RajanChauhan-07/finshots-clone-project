// frontend/src/ArticleForm.jsx
import React, { useState, useEffect } from 'react';

const ArticleForm = ({ backendUrl, editingArticle, onSuccess }) => {
    const initialFormState = {
        title: '',
        summary: '',
        body: '',
        author: '',
        category: 'Fintech', // Default category
        imageUrl: '',
        publishedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    const [formData, setFormData] = useState(initialFormState);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Populate form if editing an article
    useEffect(() => {
        if (editingArticle) {
            setFormData({
                title: editingArticle.title || '',
                summary: editingArticle.summary || '',
                body: editingArticle.body || '',
                author: editingArticle.author || '',
                category: editingArticle.category || 'Fintech',
                imageUrl: editingArticle.imageUrl || '',
                publishedAt: editingArticle.publishedAt
                    ? new Date(editingArticle.publishedAt).toISOString().split('T')[0] // Format for date input
                    : new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData(initialFormState); // Reset form for new article
        }
        setSubmitSuccess(false); // Reset success message on form change
        setSubmitError(null); // Reset error message on form change
    }, [editingArticle]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        const method = editingArticle ? 'PUT' : 'POST';
        const url = editingArticle
            ? `<span class="math-inline">\{backendUrl\}/api/admin/articles/</span>{editingArticle.id}`
            : `${backendUrl}/api/admin/articles`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setSubmitSuccess(true);
            setFormData(initialFormState); // Clear form after successful submission
            if (onSuccess) {
                onSuccess(); // Notify parent (AdminPanel) to re-fetch articles
            }
            alert(`Article ${editingArticle ? 'updated' : 'added'} successfully!`);
        } catch (err) {
            console.error("Error submitting article:", err);
            setSubmitError(`Failed to ${editingArticle ? 'update' : 'add'} article: ${err.message}`);
            alert(`Failed to ${editingArticle ? 'update' : 'add'} article: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
            </div>
            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
                <textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    required
                    rows="8"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
            </div>
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    <option value="Fintech">Fintech</option>
                    <option value="Economy">Economy</option>
                    <option value="Startups">Startups</option>
                    <option value="Investments">Investments</option>
                    <option value="ESG">ESG</option>
                </select>
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">Published Date</label>
                <input
                    type="date"
                    id="publishedAt"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>

            {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
            {submitSuccess && <p className="text-green-500 text-sm mt-2">Operation successful!</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
                {submitting ? 'Submitting...' : (editingArticle ? 'Update Article' : 'Add Article')}
            </button>
        </form>
    );
};

export default ArticleForm;