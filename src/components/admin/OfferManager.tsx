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
            if (Array.isArray(data)) {
                setOffers(data);
            } else {
                setOffers([]);
            }
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
        <div className="bg-[#111] border border-white/5 rounded-2xl shadow-sm p-4 md:p-6 w-full overflow-hidden text-stone-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Gift size={22} className="text-stone-400" />
                Manage Offers
            </h2>
            <p className="text-stone-500 mb-6 text-sm">Active offers will pop up on the home page as a premium modal.</p>

            {/* Add Form */}
            <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-2xl mb-8 border border-white/5 grid gap-4 w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Offer Title *</label>
                        <input
                            placeholder="e.g. Special Family Deal"
                            className="w-full p-3 border border-stone-800 bg-[#111] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Description (English/Arabic)</label>
                        <textarea
                            placeholder="Describe the offer..."
                            className="w-full p-3 border border-stone-800 bg-[#111] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all resize-none placeholder-stone-600"
                            rows={1}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Price (optional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full p-3 pl-8 border border-stone-800 bg-[#111] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                                value={form.price || ''}
                                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-stone-400 mb-1 block">Expires At</label>
                        <div className="relative group">
                            <input
                                type="datetime-local"
                                className="w-full p-3 pr-10 border border-stone-800 bg-[#111] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all [color-scheme:dark]"
                                value={form.expiresAt}
                                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                            />
                            {form.expiresAt && (
                                <button
                                    onClick={() => setForm({ ...form, expiresAt: '' })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-red-400 transition-colors"
                                    title="Clear Expiry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto bg-white text-black px-8 py-2.5 rounded-lg font-bold hover:bg-stone-200 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        {loading ? 'Processing...' : 'Create Offer'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {offers.map(offer => (
                    <div key={offer._id} className="border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1a1a1a] hover:border-white/20 transition-all max-w-full">
                        <div className="min-w-0 flex-1">
                            <div className="font-bold flex items-center gap-3 mb-2">
                                <span className="text-white text-lg truncate block" title={offer.title}>{offer.title}</span>
                                {offer.isActive ? <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md shadow-[0_0_10px_rgba(255,255,255,0.05)]">Active</span> : <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md">Inactive</span>}
                            </div>
                            <div className="text-sm text-stone-400 break-words mb-3">{offer.description}</div>
                            {offer.expiresAt && (
                                <div className="text-[11px] font-bold tracking-wide text-stone-400 flex items-center gap-2 bg-[#111] border border-stone-800 w-fit px-3 py-1.5 rounded-lg">
                                    <Clock size={14} className="text-stone-500" />
                                    <span>Expires: {formatExpiry(offer.expiresAt)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0 w-full justify-end sm:w-auto">
                            <button onClick={() => toggleActive(offer)} className="text-stone-500 hover:text-white transition-colors p-2" title="Toggle Active">
                                {offer.isActive ? <ToggleRight size={24} className="text-white" /> : <ToggleLeft size={24} />}
                            </button>
                            <button onClick={() => handleDelete(offer._id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/50 p-2 rounded-lg transition-colors bg-red-500/10 border border-red-500/20">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfferManager;

