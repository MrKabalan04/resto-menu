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
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="py-3 relative overflow-hidden group hover:bg-white/5 rounded-lg px-3 transition-colors duration-200"
        >
            <div className="flex items-end justify-between w-full gap-2">
                <div className="flex flex-col items-start min-w-0 flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-stone-100 leading-tight w-full break-words whitespace-normal">
                        <span className="font-ar tracking-wide">{nameAr}</span>
                        <span className="text-stone-600 font-normal mx-2 text-sm hidden md:inline">|</span>
                        <span className="font-en text-stone-400 text-sm font-semibold hidden md:inline">{name}</span>
                    </h3>
                    <h3 className="text-[10px] font-en text-stone-500 font-bold md:hidden mt-0.5 uppercase tracking-tighter w-full whitespace-normal">{name}</h3>
                </div>

                <div className="dotted-leader opacity-20 flex-1 hidden xs:block mb-1.5 self-center"></div>

                <div className="text-lg md:text-xl font-bold text-white whitespace-nowrap tabular-nums pb-0.5 shrink-0 self-end">
                    {formatPrice(price, currency, exchangeRate, priceCurrency)}
                </div>
            </div>

            {(description || descriptionAr) && (
                <div className="mt-1.5 text-sm text-stone-400">
                    {description && <p>{description}</p>}
                    {descriptionAr && <p className="font-ar text-right mt-0.5">{descriptionAr}</p>}
                </div>
            )}

            {imageUrl && (
                <div className="flex flex-col items-end gap-2 mt-3">
                    <img src={imageUrl} alt={name} className="w-20 h-20 object-cover rounded-lg shadow-sm border border-red-100" />
                </div>
            )}
        </motion.div>
    );
};

export default MenuItem;
