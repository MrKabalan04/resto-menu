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
                if (Array.isArray(data) && data.length > 0) {
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
                        className="fixed bottom-4 left-4 z-40 bg-white text-black px-4 py-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center gap-2 hover:bg-stone-200 transition-colors"
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Offer Counter */}
                            {offers.length > 1 && (
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/10 text-xs px-3 py-1.5 rounded-full z-10 font-bold tracking-widest">
                                    {currentIndex + 1} / {offers.length}
                                </div>
                            )}

                            {currentOffer.imageUrl && (
                                <div className="h-48 w-full bg-[#1a1a1a]">
                                    <img src={currentOffer.imageUrl} alt={currentOffer.title} className="w-full h-full object-cover opacity-80" />
                                </div>
                            )}

                            <div className="p-8 text-center text-stone-200">
                                <h2 className="text-3xl font-heading font-extrabold text-white mb-2">
                                    {language === 'en' ? currentOffer.title : currentOffer.titleAr}
                                </h2>
                                <p className="text-stone-400 mb-6 font-medium">
                                    {language === 'en' ? currentOffer.description : currentOffer.descriptionAr}
                                </p>

                                {currentOffer.price && (
                                    <div className="text-2xl font-bold bg-[#1a1a1a] border border-white/5 py-3 rounded-xl mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] text-white">
                                        {formatPrice(currentOffer.price, currency, exchangeRate)}
                                    </div>
                                )}

                                {/* Navigation Buttons for Multiple Offers */}
                                {offers.length > 1 && (
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        <button
                                            onClick={prevOffer}
                                            className="p-3 bg-[#1a1a1a] hover:bg-white/10 border border-white/5 rounded-full transition-colors text-stone-300 hover:text-white"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div className="flex gap-2">
                                            {offers.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentIndex(i)}
                                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-6' : 'bg-stone-700 hover:bg-stone-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={nextOffer}
                                            className="p-3 bg-[#1a1a1a] hover:bg-white/10 border border-white/5 rounded-full transition-colors text-stone-300 hover:text-white"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={handleClose}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-stone-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] text-lg"
                                >
                                    {language === 'en' ? 'View Menu' : 'عرض القائمة'}
                                </button>
                            </div>

                            {/* Close X */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 bg-black/60 backdrop-blur-md hover:bg-white hover:text-black border border-white/10 text-white rounded-full p-2 shadow-md transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OfferPopup;

