import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Currency = 'USD' | 'LBP';

interface MenuContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    currency: Currency;
    setCurrency: (curr: Currency) => void;
    exchangeRate: number;
    setExchangeRate: (rate: number) => void;
    toggleLanguage: () => void;
    toggleCurrency: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [exchangeRate, setExchangeRate] = useState<number>(89500); // Default, will fetch from API

    const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    const toggleCurrency = () => setCurrency(prev => prev === 'USD' ? 'LBP' : 'USD');

    // Load settings on mount
    useEffect(() => {
        fetch('/.netlify/functions/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.lbpRate) setExchangeRate(data.lbpRate);
            })
            .catch(err => console.error("Failed to fetch settings", err));
    }, []);

    useEffect(() => {
        // Set HTML dir attribute for RTL support
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    return (
        <MenuContext.Provider value={{
            language, setLanguage, toggleLanguage,
            currency, setCurrency, toggleCurrency,
            exchangeRate, setExchangeRate
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) throw new Error('useMenu must be used within a MenuProvider');
    return context;
};
