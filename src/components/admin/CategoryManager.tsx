import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Tag } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    nameAr: string;
    order: number;
}

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState('');
    const [newNameAr, setNewNameAr] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editNameAr, setEditNameAr] = useState('');

    const getAuthHeaders = () => ({
        'x-admin-username': localStorage.getItem('adminUsername') || '',
        'x-admin-password': localStorage.getItem('adminPassword') || '',
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch('/.netlify/functions/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!newName || !newNameAr) {
            alert('Both English and Arabic names are required');
            return;
        }
        setLoading(true);
        try {
            await fetch('/.netlify/functions/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ name: newName, nameAr: newNameAr, order: categories.length }),
            });
            setNewName('');
            setNewNameAr('');
            fetchCategories();
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat._id);
        setEditName(cat.name);
        setEditNameAr(cat.nameAr);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditNameAr('');
    };

    const handleSaveEdit = async (id: string) => {
        if (!editName || !editNameAr) {
            alert('Both names are required');
            return;
        }
        try {
            const res = await fetch(`/.netlify/functions/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ name: editName, nameAr: editNameAr }),
            });
            if (res.ok) {
                setEditingId(null);
                fetchCategories();
                alert('Category updated');
            } else {
                const data = await res.json();
                alert(`Update failed: ${data.message || 'Unauthorized'}`);
            }
        } catch (err) {
            alert('Error updating category');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}"? Items in this category will become uncategorized.`)) return;
        try {
            const res = await fetch(`/.netlify/functions/api/categories/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                alert('Category deleted');
                fetchCategories();
            } else {
                const data = await res.json();
                alert(`Delete failed: ${data.message || 'Unauthorized'}`);
            }
        } catch (err) {
            alert('Error deleting category');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag size={22} className="text-lava" />
                Manage Categories
            </h2>

            {/* Add Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">➕ Add New Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Name (English) *</label>
                        <input
                            placeholder="e.g. Appetizers"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Name (Arabic) *</label>
                        <input
                            placeholder="مثال: مقبلات"
                            value={newNameAr}
                            onChange={e => setNewNameAr(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg text-right focus:ring-2 focus:ring-lava focus:border-transparent"
                            dir="rtl"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={loading || !newName || !newNameAr}
                    className="bg-lava text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Categories List */}
            <div className="space-y-3">
                <div className="text-sm text-gray-500 mb-2">
                    {categories.length} categories total
                </div>

                {categories.map((cat, index) => (
                    <div
                        key={cat._id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                        {editingId === cat._id ? (
                            /* Edit Mode */
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                                        placeholder="English name"
                                    />
                                    <input
                                        value={editNameAr}
                                        onChange={e => setEditNameAr(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-lava focus:border-transparent"
                                        dir="rtl"
                                        placeholder="Arabic name"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSaveEdit(cat._id)}
                                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        <Check size={16} /> Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-8 h-8 bg-lava/10 text-lava rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-4 flex-1 min-w-0">
                                        <span className="font-semibold text-gray-900 truncate">{cat.name}</span>
                                        <span className="text-gray-600 sm:text-right font-ar" dir="rtl">{cat.nameAr}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:ml-4 justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id, cat.name)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No categories yet. Add your first category above!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;


