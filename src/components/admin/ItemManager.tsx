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
        <div className="bg-[#111] border border-white/5 rounded-2xl shadow-sm p-4 md:p-6 w-full overflow-hidden text-stone-200">
            <h2 className="text-xl font-bold mb-6 text-white">Manage Menu Items</h2>

            {editingId && (
                <div className="bg-blue-950/30 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                    <div>
                        <p className="text-blue-400 font-bold">You are currently editing:</p>
                        <p className="text-blue-200 text-lg">"{form.name}"</p>
                    </div>
                    <button
                        onClick={() => { setEditingId(null); setForm({ categoryId: '', name: '', nameAr: '', description: '', descriptionAr: '', price: '', priceCurrency: 'USD', isAvailable: true }); }}
                        className="text-blue-400 hover:text-blue-300 font-medium bg-[#1a1a1a] px-4 py-2 rounded-lg border border-blue-500/30 w-full sm:w-auto text-center"
                    >
                        Cancel Edit
                    </button>
                </div>
            )}

            {/* Form */}
            <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-2xl mb-8 border border-white/5 overflow-hidden w-full">
                <h3 className="font-semibold text-stone-300 mb-4">{editingId ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Category *</label>
                        <select
                            className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none transition-all"
                            value={form.categoryId}
                            onChange={e => setForm({ ...form, categoryId: e.target.value })}
                        >
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm font-bold text-stone-400 mb-1 block">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none transition-all"
                                value={form.price}
                                onChange={e => {
                                    const val = e.target.value;
                                    setForm({ ...form, price: val === '' ? '' : Number(val) });
                                }}
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-sm font-bold text-stone-400 mb-1 block">Currency</label>
                            <select
                                className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none transition-all"
                                value={form.priceCurrency}
                                onChange={e => setForm({ ...form, priceCurrency: e.target.value as 'USD' | 'LBP' })}
                            >
                                <option value="USD">$</option>
                                <option value="LBP">LBP</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Name (English) *</label>
                        <input
                            className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none transition-all"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Name (Arabic)</label>
                        <input
                            className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white text-right focus:ring-1 focus:ring-white focus:border-white outline-none transition-all"
                            dir="rtl"
                            value={form.nameAr}
                            onChange={e => setForm({ ...form, nameAr: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea
                            placeholder="Description (English)"
                            className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none transition-all resize-none"
                            rows={2}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                        <textarea
                            placeholder="وصف بالعربي"
                            className="w-full p-3 border border-stone-800 rounded-lg bg-[#111] text-white text-right focus:ring-1 focus:ring-white focus:border-white outline-none transition-all resize-none"
                            dir="rtl"
                            rows={2}
                            value={form.descriptionAr}
                            onChange={e => setForm({ ...form, descriptionAr: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer bg-[#111] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={form.isAvailable}
                                onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                                className="w-5 h-5 rounded accent-white"
                            />
                            <span className="font-bold text-stone-300 text-sm">Item is Available (Visible on menu)</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    {editingId && (
                        <button
                            onClick={() => { setEditingId(null); setForm({ categoryId: '', name: '', nameAr: '', description: '', descriptionAr: '', price: '', priceCurrency: 'USD', isAvailable: true }); }}
                            className="w-full sm:w-auto px-6 py-2.5 text-stone-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-bold border border-transparent hover:border-white/10"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto bg-white text-black px-8 py-2.5 rounded-lg font-bold hover:bg-stone-200 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        {editingId ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Filter By:</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${selectedCategory === 'all'
                            ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                            : 'bg-[#1a1a1a] text-stone-400 border-white/5 hover:bg-[#222]'
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
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${selectedCategory === c._id
                                    ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                    : 'bg-[#1a1a1a] text-stone-400 border-white/5 hover:bg-[#222]'
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
                        className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-4">
                                <div className="mb-2">
                                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white/10 text-stone-300 rounded-md">
                                        {getCategoryName(item.categoryId)}
                                    </span>
                                </div>
                                <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                <p className="text-sm text-stone-400 font-ar mb-2" dir="rtl">{item.nameAr}</p>
                                {item.description && (
                                    <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-bold text-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                    {item.priceCurrency === 'USD' ? <DollarSign size={14} /> : null}
                                    {item.price.toLocaleString()} {item.priceCurrency === 'LBP' ? 'LBP' : ''}
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${item.isAvailable ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {item.isAvailable ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
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
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors rounded-lg border ${item.isAvailable ? 'text-stone-400 border-white/5 hover:bg-white/5' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}
                                title={item.isAvailable ? 'Hide Item' : 'Show Item'}
                            >
                                {item.isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                {item.isAvailable ? 'Hide' : 'Show'}
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg transition-colors"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-16 text-stone-600 bg-[#1a1a1a] rounded-2xl border border-white/5 mt-4 flex flex-col items-center">
                    <span className="text-4xl mb-4 opacity-50">🍽️</span>
                    <span className="font-bold tracking-wide">No items found in this section.</span>
                </div>
            )}
        </div>
    );
};

export default ItemManager;


