import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../context/MenuContext';
import { formatPrice } from '../utils';
import { ChevronLeft, ChevronRight, Gift, X } from 'lucide-react';

interface Offer {
    _id: string;
    title: string;
    titleAr: string;
    description?: string;
    descriptionAr?: string;
    price?: number;
    imageUrl?: string;
    expiresAt?: string;
}

const OfferPopup: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [hasOffers, setHasOffers] = useState(false);
    const { language, currency, exchangeRate } = useMenu();

    useEffect(() => {
        fetch('/.netlify/functions/api/offers')
            .then(res => res.json())
            .then((data: Offer[]) => {
                if (data && data.length > 0) {
                    setOffers(data);
                    setHasOffers(true);
                    setIsVisible(true);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleClose = () => setIsVisible(false);
    const handleOpen = () => {
        setCurrentIndex(0);
        setIsVisible(true);
    };

    const nextOffer = () => {
        setCurrentIndex(prev => (prev + 1) % offers.length);
    };

    const prevOffer = () => {
        setCurrentIndex(prev => (prev - 1 + offers.length) % offers.length);
    };

    const currentOffer = offers[currentIndex];

    return (
        <>
            {/* Floating Button to Re-open Offers */}
            <AnimatePresence>
                {hasOffers && !isVisible && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={handleOpen}
                        className="fixed bottom-4 left-4 z-40 bg-lava text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
                    >
                        <Gift size={20} />
                        <span className="font-bold">
                            {offers.length} {offers.length === 1 ? 'Offer' : 'Offers'}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Offer Modal */}
            <AnimatePresence>
                {isVisible && currentOffer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Offer Counter */}
                            {offers.length > 1 && (
                                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                                    {currentIndex + 1} / {offers.length}
                                </div>
                            )}

                            {currentOffer.imageUrl && (
                                <div className="h-48 w-full bg-gray-200">
                                    <img src={currentOffer.imageUrl} alt={currentOffer.title} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="p-6 text-center">
                                <h2 className="text-3xl font-heading font-extrabold text-lava mb-2">
                                    {language === 'en' ? currentOffer.title : currentOffer.titleAr}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {language === 'en' ? currentOffer.description : currentOffer.descriptionAr}
                                </p>

                                {currentOffer.price && (
                                    <div className="text-2xl font-bold bg-gray-50 py-2 rounded-lg mb-4">
                                        {formatPrice(currentOffer.price, currency, exchangeRate)}
                                    </div>
                                )}

                                {/* Navigation Buttons for Multiple Offers */}
                                {offers.length > 1 && (
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <button
                                            onClick={prevOffer}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div className="flex gap-1">
                                            {offers.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentIndex(i)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-lava' : 'bg-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={nextOffer}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={handleClose}
                                    className="w-full bg-lava text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                                >
                                    {language === 'en' ? 'View Menu' : 'عرض القائمة'}
                                </button>
                            </div>

                            {/* Close X */}
                            <button
                                onClick={handleClose}
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-md"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OfferPopup;

