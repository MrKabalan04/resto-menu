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
        <div className="bg-[#111] border border-white/5 rounded-2xl shadow-sm p-4 md:p-6 w-full overflow-hidden text-stone-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Tag size={22} className="text-stone-400" />
                Manage Categories
            </h2>

            {/* Add Form */}
            <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-2xl mb-6 border border-white/5 w-full overflow-hidden">
                <h3 className="font-semibold text-stone-300 mb-4">➕ Add New Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="w-full">
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Name (English) *</label>
                        <input
                            placeholder="e.g. Appetizers"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="w-full p-3 border border-stone-800 bg-[#111] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-stone-600 transition-all"
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Name (Arabic) *</label>
                        <input
                            placeholder="مثال: مقبلات"
                            value={newNameAr}
                            onChange={e => setNewNameAr(e.target.value)}
                            className="w-full p-3 border border-stone-800 bg-[#111] text-white rounded-lg text-right focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-stone-600 transition-all"
                            dir="rtl"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={loading || !newName || !newNameAr}
                    className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-stone-200 flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Categories List */}
            <div className="space-y-3">
                <div className="text-sm text-stone-500 mb-2">
                    {categories.length} categories total
                </div>

                {categories.map((cat, index) => (
                    <div
                        key={cat._id}
                        className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all"
                    >
                        {editingId === cat._id ? (
                            /* Edit Mode */
                            <div className="space-y-3 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full p-2 border border-stone-800 bg-[#111] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none"
                                        placeholder="English name"
                                    />
                                    <input
                                        value={editNameAr}
                                        onChange={e => setEditNameAr(e.target.value)}
                                        className="w-full p-2 border border-stone-800 bg-[#111] text-white rounded-lg text-right focus:ring-1 focus:ring-white focus:border-white outline-none"
                                        dir="rtl"
                                        placeholder="Arabic name"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSaveEdit(cat._id)}
                                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-600/30 transition-colors font-medium text-sm"
                                    >
                                        <Check size={16} /> Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-1 px-4 py-2 bg-stone-800 text-stone-300 rounded-lg hover:bg-stone-700 transition-colors font-medium text-sm"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-8 h-8 bg-white/10 text-white rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-4 flex-1 min-w-0">
                                        <span className="font-semibold text-stone-200 truncate">{cat.name}</span>
                                        <span className="text-stone-400 sm:text-right font-ar" dir="rtl">{cat.nameAr}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:ml-4 justify-end border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-950/50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id, cat.name)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-12 text-stone-500">
                        No categories yet. Add your first category above!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;


