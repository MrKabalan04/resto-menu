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
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">General Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate (1 USD = ? LBP)</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={e => setRate(Number(e.target.value))}
                            className="w-full p-3 border border-gray-200 rounded-lg font-mono focus:ring-2 focus:ring-lava focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-lava text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Admin Credentials */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Key size={20} className="text-lava" />
                    Admin Credentials
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Update your login credentials. Changes here update localStorage only. Remember to update server environment variables.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <User size={14} className="inline mr-1" /> Username
                        </label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={handleUpdateCredentials}
                        className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-900 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Key size={18} /> Update Credentials
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;

