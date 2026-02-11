import React, { useState, useEffect } from 'react';
import { Trash2, ToggleLeft, ToggleRight, Clock, Gift } from 'lucide-react';

interface Offer {
    _id: string;
    title: string;
    description: string;
    price: number;
    expiresAt?: string;
    isActive: boolean;
}

const OfferManager: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => ({
        'x-admin-username': localStorage.getItem('adminUsername') || '',
        'x-admin-password': localStorage.getItem('adminPassword') || '',
    });

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: 0,
        expiresAt: '',
        isActive: true,
    });

    const fetchOffers = async () => {
        try {
            const res = await fetch('/.netlify/functions/api/offers/all', {
                headers: getAuthHeaders()
            });
            if (!res.ok) {
                console.error('Failed to fetch offers:', res.status);
                setOffers([]);
                return;
            }
            const data = await res.json();
            setOffers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setOffers([]);
        }
    };

    useEffect(() => { fetchOffers(); }, []);

    const handleSubmit = async () => {
        if (!form.title) {
            alert('Title is required');
            return;
        }
        setLoading(true);
        try {
            await fetch('/.netlify/functions/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({
                    ...form,
                    titleAr: form.title, // Backend expects titleAr, use same value
                    descriptionAr: form.description,
                    expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
                }),
            });
            setForm({ title: '', description: '', price: 0, expiresAt: '', isActive: true });
            fetchOffers();
        } catch (err) {
            alert('Error creating offer');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete offer?')) return;
        try {
            const res = await fetch(`/.netlify/functions/api/offers/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (res.ok) {
                alert('Offer deleted');
                fetchOffers();
            } else {
                const data = await res.json();
                alert(`Delete failed: ${data.message || 'Unauthorized'}`);
            }
        } catch (err) {
            alert('Error deleting offer');
        }
    };

    const toggleActive = async (offer: Offer) => {
        try {
            const res = await fetch(`/.netlify/functions/api/offers/${offer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ isActive: !offer.isActive }),
            });
            if (res.ok) {
                fetchOffers();
            } else {
                const data = await res.json();
                alert(`Update failed: ${data.message || 'Unauthorized'}`);
            }
        } catch (err) {
            alert('Error updating offer');
        }
    };

    const formatExpiry = (dateStr?: string) => {
        if (!dateStr) return 'No Expiry';
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Gift size={22} className="text-lava" />
                Manage Offers
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Active offers will pop up on the home page as a premium modal.</p>

            {/* Add Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-8 border border-gray-100 grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Offer Title *</label>
                        <input
                            placeholder="e.g. Special Family Deal"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent transition-all"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Description (English/Arabic)</label>
                        <textarea
                            placeholder="Describe the offer..."
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent transition-all resize-none"
                            rows={1}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Price (optional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full p-3 pl-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent transition-all"
                                value={form.price || ''}
                                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Expires At</label>
                        <div className="relative group">
                            <input
                                type="datetime-local"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent transition-all"
                                value={form.expiresAt}
                                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                            />
                            {form.expiresAt && (
                                <button
                                    onClick={() => setForm({ ...form, expiresAt: '' })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Clear Expiry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-lava text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                    >
                        {loading ? 'Processing...' : 'Create Offer'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {offers.map(offer => (
                    <div key={offer._id} className="border p-4 rounded flex justify-between items-center bg-white">
                        <div>
                            <div className="font-bold flex items-center gap-2">
                                {offer.title}
                                {offer.isActive ? <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Active</span> : <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">Inactive</span>}
                            </div>
                            <div className="text-sm text-gray-600">{offer.description}</div>
                            {offer.expiresAt && (
                                <div className="text-xs font-medium text-gray-400 mt-1.5 flex items-center gap-1.5 bg-gray-50 w-fit px-2 py-1 rounded">
                                    <Clock size={12} className="text-lava" />
                                    <span>Expires: {formatExpiry(offer.expiresAt)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => toggleActive(offer)} className="text-gray-600 hover:text-lava" title="Toggle Active">
                                {offer.isActive ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
                            </button>
                            <button onClick={() => handleDelete(offer._id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfferManager;

