import React, { useState, useEffect } from 'react';
import { Save, Key, User } from 'lucide-react';

const SettingsManager: React.FC = () => {
    const [rate, setRate] = useState<number>(0);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Credentials state
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const getAuthHeaders = () => ({
        'x-admin-username': localStorage.getItem('adminUsername') || '',
        'x-admin-password': localStorage.getItem('adminPassword') || '',
    });

    const fetchSettings = async () => {
        try {
            const res = await fetch('/.netlify/functions/api/settings');
            const data = await res.json();
            setRate(data.lbpRate);
            setName(data.restaurantName);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSettings();
        // Pre-fill current username
        setNewUsername(localStorage.getItem('adminUsername') || '');
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch('/.netlify/functions/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ lbpRate: rate, restaurantName: name }),
            });
            alert('Settings Saved!');
        } catch (err) {
            alert('Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCredentials = async () => {
        if (!newUsername) {
            alert('Username is required');
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/.netlify/functions/api/auth/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ newUsername, newPassword: newPassword || undefined }),
            });

            if (res.ok) {
                // Update localStorage with new credentials
                localStorage.setItem('adminUsername', newUsername);
                if (newPassword) {
                    localStorage.setItem('adminPassword', newPassword);
                }
                alert('Credentials updated successfully in database!');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await res.json();
                alert(`Update failed: ${data.message}`);
            }
        } catch (err) {
            alert('Error updating credentials on server');
        }
    };

    return (
        <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-[#111] border border-white/5 rounded-2xl shadow-sm p-4 md:p-6 text-stone-200">
                <h2 className="text-xl font-bold mb-6 text-white">General Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-stone-400 mb-1">Restaurant Name</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 border border-stone-800 bg-[#1a1a1a] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-400 mb-1">Exchange Rate (1 USD = ? LBP)</label>
                        <input
                            type="text"
                            value={rate === 0 ? '' : rate}
                            onChange={e => {
                                const val = e.target.value;
                                if (val === '') {
                                    setRate(0);
                                } else {
                                    const numVal = Number(val);
                                    if (!isNaN(numVal)) setRate(numVal);
                                }
                            }}
                            placeholder="0"
                            className="w-full p-3 border border-stone-800 bg-[#1a1a1a] text-white rounded-lg font-mono focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-stone-200 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 w-full sm:w-auto"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Admin Credentials */}
            <div className="bg-[#111] border border-white/5 rounded-2xl shadow-sm p-4 md:p-6 text-stone-200">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                    <Key size={20} className="text-stone-400" />
                    Admin Credentials
                </h2>
                <p className="text-sm text-stone-500 mb-6">
                    Update your login credentials. Changes here update localStorage only. Remember to update server environment variables.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-stone-400 mb-1">
                            <User size={14} className="inline mr-1" /> Username
                        </label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            className="w-full p-3 border border-stone-800 bg-[#1a1a1a] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-400 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            className="w-full p-3 border border-stone-800 bg-[#1a1a1a] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-400 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full p-3 border border-stone-800 bg-[#1a1a1a] text-white rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all placeholder-stone-600"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleUpdateCredentials}
                            className="bg-stone-800 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-stone-700 flex items-center justify-center gap-2 transition-colors border border-stone-700 hover:border-stone-500 w-full sm:w-auto"
                        >
                            <Key size={18} /> Update Credentials
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;

