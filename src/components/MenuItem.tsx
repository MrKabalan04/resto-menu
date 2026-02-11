import React from 'react';
import { useMenu } from '../context/MenuContext';
import { formatPrice } from '../utils';
import { motion } from 'framer-motion';

interface MenuItemProps {
    name: string;
    nameAr: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    priceCurrency?: 'USD' | 'LBP';
    imageUrl?: string;
    isAvailable: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
    name, nameAr, description, descriptionAr, price, priceCurrency = 'USD', imageUrl, isAvailable
}) => {
    const { currency, exchangeRate } = useMenu();

    if (!isAvailable) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-3 relative overflow-hidden group"
        >
            <div className="flex items-start justify-between gap-4 w-full">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold uppercase text-gray-900 leading-tight">
                        {name} <span className="text-gray-300 font-normal mx-1 text-base">|</span> <span className="font-ar text-gray-600 text-lg">{nameAr}</span>
                    </h3>
                </div>
                <div className="text-xl font-bold text-lava whitespace-nowrap pt-0.5">
                    {formatPrice(price, currency, exchangeRate, priceCurrency)}
                </div>
            </div>

            {(description || descriptionAr) && (
                <div className="mt-2 text-sm text-gray-500">
                    {description && <p>{description}</p>}
                    {descriptionAr && <p className="font-ar text-right mt-1">{descriptionAr}</p>}
                </div>
            )}

            {imageUrl && (
                <div className="flex flex-col items-end gap-2 mt-3">
                    <img src={imageUrl} alt={name} className="w-20 h-20 object-cover rounded-md shadow-sm border border-white/20" />
                </div>
            )}
        </motion.div>
    );
};

export default MenuItem;
