import React from 'react';
import { useMenu } from '../context/MenuContext';
import { motion } from 'framer-motion';

const CurrencyToggle: React.FC = () => {
    const { currency, toggleCurrency } = useMenu();

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCurrency}
                className="w-14 h-14 rounded-full bg-white text-lava shadow-lg flex items-center justify-center font-bold text-xl border-2 border-lava"
            >
                {currency === 'USD' ? '$' : <span className="text-xs">LBP</span>}
            </motion.button>
        </div>
    );
};

export default CurrencyToggle;
