import React from 'react';
import { useMenu } from '../context/MenuContext';
import { motion } from 'framer-motion';

const CurrencyToggle: React.FC = () => {
    const { currency, toggleCurrency } = useMenu();

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[110]">
            {/* Currency Toggle */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCurrency}
                className="w-16 h-16 rounded-full bg-[#1a1a1a] text-stone-200 border-2 border-stone-800 hover:bg-[#252525] shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-center font-bold text-xl transition-all"
            >
                {currency === 'USD' ? '$' : <span className="text-xs font-bold text-stone-300">LBP</span>}
            </motion.button>
        </div>
    );
};

export default CurrencyToggle;
