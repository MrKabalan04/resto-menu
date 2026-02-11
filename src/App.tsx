import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MenuProvider } from './context/MenuContext';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
    return (
        <MenuProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MenuPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </Router>
        </MenuProvider>
    );
};

export default App;
