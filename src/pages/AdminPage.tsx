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
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-en relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-sm relative z-10">
                    <div className="flex justify-center mb-6 text-black">
                        <div className="bg-white p-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <Lock size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2 text-white">Admin Login</h2>
                    <p className="text-stone-500 text-center text-sm mb-6 uppercase tracking-widest">Powered by Mr Kabalan</p>

                    {error && (
                        <div className="bg-red-950/50 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-3 pl-10 border border-white/10 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-stone-600 transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 pl-10 border border-white/10 rounded-lg bg-[#111] text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-stone-600 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-stone-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex font-en text-stone-200">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111] border-r border-white/5 z-10 hidden md:flex md:flex-col shadow-2xl">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
                    <p className="text-xs text-stone-500 mt-1">Welcome, <span className="text-stone-300">{username}</span></p>
                </div>
                <nav className="mt-4 flex-1 space-y-1 py-2">
                    <AdminNavItem icon={<Tag />} label="Categories" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
                    <AdminNavItem icon={<Utensils />} label="Menu Items" active={activeTab === 'items'} onClick={() => setActiveTab('items')} />
                    <AdminNavItem icon={<Gift />} label="Offers" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
                    <AdminNavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Header */}
            <div className="md:hidden fixed top-0 w-full bg-[#111]/90 backdrop-blur-md border-b border-white/5 shadow-md z-20 flex justify-between p-4 items-center">
                <h1 className="text-xl font-bold text-white">Admin</h1>
                <div className="flex gap-2 items-center">
                    <button onClick={() => setActiveTab('categories')} className={`p-2 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-stone-400 border border-white/5'}`}><Tag size={18} /></button>
                    <button onClick={() => setActiveTab('items')} className={`p-2 rounded-lg transition-colors ${activeTab === 'items' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-stone-400 border border-white/5'}`}><Utensils size={18} /></button>
                    <button onClick={() => setActiveTab('offers')} className={`p-2 rounded-lg transition-colors ${activeTab === 'offers' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-stone-400 border border-white/5'}`}><Gift size={18} /></button>
                    <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-stone-400 border border-white/5'}`}><Settings size={18} /></button>
                    <button onClick={handleLogout} className="p-2 rounded-lg bg-red-950/30 text-red-500 ml-1 border border-red-900/30"><LogOut size={18} /></button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 pt-24 md:pt-10 min-h-screen w-full overflow-hidden">
                <div className="w-full max-w-4xl mx-auto overflow-hidden">
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
        className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all ${active ? 'bg-white/5 text-white border-r-4 border-white font-bold' : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'}`}
    >
        {icon}
        <span className="font-medium text-sm tracking-wide">{label}</span>
    </button>
);

export default AdminPage;

