import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
}

interface Item {
    _id: string;
    categoryId: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: number;
    priceCurrency: 'USD' | 'LBP';
    isAvailable: boolean;
}

const ItemManager: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const getAuthHeaders = () => ({
        'x-admin-username': localStorage.getItem('adminUsername') || '',
        'x-admin-password': localStorage.getItem('adminPassword') || '',
    });

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<{
        categoryId: string;
        name: string;
        nameAr: string;
        description: string;
        descriptionAr: string;
        price: number | '';
        priceCurrency: 'USD' | 'LBP';
        isAvailable: boolean;
    }>({
        categoryId: '',
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        price: '',
        priceCurrency: 'USD',
        isAvailable: true,
    });

    const fetchData = async () => {
        try {
            const [catRes, itemRes] = await Promise.all([
                fetch('/.netlify/functions/api/categories'),
                fetch('/.netlify/functions/api/items')
            ]);
            const [cats, itemData] = await Promise.all([catRes.json(), itemRes.json()]);
            if (Array.isArray(cats)) setCategories(cats);
            if (Array.isArray(itemData)) setItems(itemData);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async () => {
        if (!form.categoryId || !form.name) {
            alert('Category and Name are required');
            return;
        }

        if (form.price !== '' && Number(form.price) < 0) {
            alert('Price cannot be negative');
            return;
        }

        setLoading(true);
        const payload = {
            ...form,
            price: form.price === '' ? 0 : Number(form.price)
        };

        try {
            const url = editingId
                ? `/.netlify/functions/api/items/${editingId}`
                : '/.netlify/functions/api/items';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setForm({
                    categoryId: '', name: '', nameAr: '', description: '', descriptionAr: '', price: '',
                    priceCurrency: 'USD', isAvailable: true
                });
                setEditingId(null);
                fetchData();
                alert(editingId ? 'Item updated' : 'Item added');
            } else {
                const data = await res.json();
                alert(`Operation failed: ${data.message || 'Unauthorized. Please logout and login again.'}`);
            }
        } catch (err) {
            alert('Error saving item');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: Item) => {
        setEditingId(item._id);
        setForm({
            categoryId: item.categoryId,
            name: item.name,
            nameAr: item.nameAr,
            description: item.description || '',
            descriptionAr: item.descriptionAr || '',
            price: item.price,
            priceCurrency: item.priceCurrency || 'USD',
            isAvailable: item.isAvailable,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        try {
            const res = await fetch(`/.netlify/functions/api/items/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                alert('Item deleted successfully');
                fetchData();
            } else {
                const data = await res.json();
                alert(`Delete failed: ${data.message || 'Unauthorized'}`);
            }
        } catch (err) {
            alert('Network error while deleting item');
        }
    };

    const filteredItems = selectedCategory === 'all'
        ? items
        : items.filter(item => item.categoryId === selectedCategory);

    const getCategoryName = (catId: string) => categories.find(c => c._id === catId)?.name || 'Unknown';

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Manage Menu Items</h2>

            {editingId && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-blue-700 font-bold">You are currently editing:</p>
                        <p className="text-blue-900 text-lg">"{form.name}"</p>
                    </div>
                    <button
                        onClick={() => { setEditingId(null); setForm({ categoryId: '', name: '', nameAr: '', description: '', descriptionAr: '', price: '', priceCurrency: 'USD', isAvailable: true }); }}
                        className="text-blue-500 hover:text-blue-700 font-medium bg-white px-3 py-1 rounded-md border border-blue-200"
                    >
                        Cancel Edit
                    </button>
                </div>
            )}

            {/* Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-8 border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">{editingId ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Category *</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-lava focus:border-transparent"
                            value={form.categoryId}
                            onChange={e => setForm({ ...form, categoryId: e.target.value })}
                        >
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                                value={form.price}
                                onChange={e => {
                                    const val = e.target.value;
                                    setForm({ ...form, price: val === '' ? '' : Number(val) });
                                }}
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Currency</label>
                            <select
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-lava focus:border-transparent"
                                value={form.priceCurrency}
                                onChange={e => setForm({ ...form, priceCurrency: e.target.value as 'USD' | 'LBP' })}
                            >
                                <option value="USD">$</option>
                                <option value="LBP">LBP</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Name (English) *</label>
                        <input
                            placeholder="e.g. Classic Burger"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Name (Arabic)</label>
                        <input
                            placeholder="مثال: برغر كلاسيك"
                            className="w-full p-3 border border-gray-200 rounded-lg text-right focus:ring-2 focus:ring-lava focus:border-transparent"
                            dir="rtl"
                            value={form.nameAr}
                            onChange={e => setForm({ ...form, nameAr: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <textarea
                            placeholder="Description (English)"
                            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent resize-none"
                            rows={2}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                        <textarea
                            placeholder="وصف بالعربي"
                            className="p-3 border border-gray-200 rounded-lg text-right focus:ring-2 focus:ring-lava focus:border-transparent resize-none"
                            dir="rtl"
                            rows={2}
                            value={form.descriptionAr}
                            onChange={e => setForm({ ...form, descriptionAr: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <input
                                type="checkbox"
                                checked={form.isAvailable}
                                onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                                className="w-5 h-5 accent-lava"
                            />
                            <span className="font-bold text-gray-700 text-sm">Item is Available (Visible on menu)</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    {editingId && (
                        <button
                            onClick={() => { setEditingId(null); setForm({ categoryId: '', name: '', nameAr: '', description: '', descriptionAr: '', price: '', priceCurrency: 'USD', isAvailable: true }); }}
                            className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-lava text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {editingId ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Filter:</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all'
                            ? 'bg-lava text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All ({items.length})
                    </button>
                    {categories.map(c => {
                        const count = items.filter(i => i.categoryId === c._id).length;
                        return (
                            <button
                                key={c._id}
                                onClick={() => setSelectedCategory(c._id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === c._id
                                    ? 'bg-lava text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {c.name} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Item Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                    <div
                        key={item._id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                        {getCategoryName(item.categoryId)}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-500" dir="rtl">{item.nameAr}</p>
                                {item.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold text-sm">
                                {item.priceCurrency === 'USD' ? <DollarSign size={14} /> : null}
                                {item.price.toLocaleString()} {item.priceCurrency === 'LBP' ? 'LBP' : ''}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.isAvailable ? 'Available' : 'Hidden'}
                            </span>
                        </div>

                        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100 transition-opacity">
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`/.netlify/functions/api/items/${item._id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                                            body: JSON.stringify({ isAvailable: !item.isAvailable }),
                                        });
                                        if (res.ok) {
                                            fetchData();
                                        } else {
                                            const data = await res.json();
                                            alert(`Update failed: ${data.message || 'Unauthorized'}`);
                                        }
                                    } catch (err) {
                                        alert('Error toggling availability');
                                    }
                                }}
                                className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors rounded-lg ${item.isAvailable ? 'text-gray-500 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
                                title={item.isAvailable ? 'Hide Item' : 'Show Item'}
                            >
                                {item.isAvailable ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                                {item.isAvailable ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => handleEdit(item)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No items found in this category
                </div>
            )}
        </div>
    );
};

export default ItemManager;


