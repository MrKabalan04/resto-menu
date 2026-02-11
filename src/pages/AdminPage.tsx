import React, { useState, useEffect } from 'react';
import { Lock, Settings, Utensils, Tag, Gift, LogOut, User } from 'lucide-react';
import CategoryManager from '../components/admin/CategoryManager';
import ItemManager from '../components/admin/ItemManager';
import OfferManager from '../components/admin/OfferManager';
import SettingsManager from '../components/admin/SettingsManager';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'offers' | 'settings'>('categories');

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            const res = await fetch('/.netlify/functions/api/auth/verify', {
                headers: {
                    'x-admin-username': username,
                    'x-admin-password': password
                }
            });

            if (res.ok) {
                // Store credentials for API calls
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('adminPassword', password);
                setIsAuthenticated(true);
                setError('');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Could not connect to server. Make sure the backend is running.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminPassword');
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        window.location.reload();
    };

    useEffect(() => {
        const savedUsername = localStorage.getItem('adminUsername');
        const savedPassword = localStorage.getItem('adminPassword');

        if (savedUsername && savedPassword) {
            // Verify them silently
            fetch('/.netlify/functions/api/auth/verify', {
                headers: {
                    'x-admin-username': savedUsername,
                    'x-admin-password': savedPassword
                }
            }).then(res => {
                if (res.ok) {
                    setUsername(savedUsername);
                    setPassword(savedPassword);
                    setIsAuthenticated(true);
                } else {
                    // Stale or wrong credentials, clear them
                    handleLogout();
                }
            }).catch(() => {
                // Network error, maybe show a warning but don't log out yet?
                // For now, just don't auto-authenticate
            });
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
                    <div className="flex justify-center mb-6 text-lava">
                        <div className="bg-lava/10 p-4 rounded-full">
                            <Lock size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
                    <p className="text-gray-500 text-center text-sm mb-6">POWERED BY MR KABALAN</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lava focus:border-transparent outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full bg-lava text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md z-10 hidden md:flex md:flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-extrabold text-lava">Admin Panel</h1>
                    <p className="text-xs text-gray-500 mt-1">Welcome, {username}</p>
                </div>
                <nav className="mt-4 flex-1">
                    <AdminNavItem icon={<Tag />} label="Categories" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
                    <AdminNavItem icon={<Utensils />} label="Menu Items" active={activeTab === 'items'} onClick={() => setActiveTab('items')} />
                    <AdminNavItem icon={<Gift />} label="Offers" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
                    <AdminNavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Header */}
            <div className="md:hidden fixed top-0 w-full bg-white shadow-sm z-20 flex justify-between p-4 items-center">
                <h1 className="text-xl font-bold text-lava">Admin</h1>
                <div className="flex gap-2 items-center">
                    <button onClick={() => setActiveTab('categories')} className={`p-2 rounded ${activeTab === 'categories' ? 'bg-lava text-white' : 'bg-gray-100'}`}><Tag size={20} /></button>
                    <button onClick={() => setActiveTab('items')} className={`p-2 rounded ${activeTab === 'items' ? 'bg-lava text-white' : 'bg-gray-100'}`}><Utensils size={20} /></button>
                    <button onClick={() => setActiveTab('offers')} className={`p-2 rounded ${activeTab === 'offers' ? 'bg-lava text-white' : 'bg-gray-100'}`}><Gift size={20} /></button>
                    <button onClick={() => setActiveTab('settings')} className={`p-2 rounded ${activeTab === 'settings' ? 'bg-lava text-white' : 'bg-gray-100'}`}><Settings size={20} /></button>
                    <button onClick={handleLogout} className="p-2 rounded bg-red-50 text-red-600"><LogOut size={20} /></button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'categories' && <CategoryManager />}
                    {activeTab === 'items' && <ItemManager />}
                    {activeTab === 'offers' && <OfferManager />}
                    {activeTab === 'settings' && <SettingsManager />}
                </div>
            </main>
        </div>
    );
};

const AdminNavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${active ? 'bg-lava/10 text-lava border-r-4 border-lava' : 'text-gray-500 hover:bg-gray-50'}`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

export default AdminPage;

