import React, { useEffect, useState } from 'react';
import CategoryList from '../components/CategoryList';
import MenuItem from '../components/MenuItem';
import CurrencyToggle from '../components/CurrencyToggle';
import OfferPopup from '../components/OfferPopup';
import { useMenu } from '../context/MenuContext';
import { formatPrice } from '../utils';
import { Phone, Bike } from 'lucide-react';
import MenuSkeleton from '../components/MenuSkeleton';

interface Category {
    _id: string;
    name: string;
    nameAr: string;
}

interface Item {
    _id: string;
    categoryId: string;
    name: string;
    nameAr: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    priceCurrency: 'USD' | 'LBP';
    isAvailable: boolean;
}

const PizzaItem = ({ pizza, currency, exchangeRate }: { pizza: any, currency: string, exchangeRate: number }) => {
    const [size, setSize] = useState<'small' | 'large'>('small');

    return (
        <div className="group flex flex-col gap-4 p-5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[1.5rem] border border-white/5 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-bold font-ar text-white group-hover:text-stone-200 transition-colors uppercase whitespace-normal">
                        {pizza.nameAr}
                    </span>
                    <span className="text-[10px] font-en text-stone-500 font-bold uppercase tracking-[0.2em] mt-1 whitespace-normal">
                        {pizza.name}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => setSize('small')}
                        className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 ${size === 'small' ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.2)]' : 'text-stone-500 hover:text-white'}`}
                    >
                        صغير
                    </button>
                    <button
                        onClick={() => setSize('large')}
                        className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 ${size === 'large' ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.2)]' : 'text-stone-500 hover:text-white'}`}
                    >
                        كبير
                    </button>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-3xl font-black text-white tabular-nums tracking-tighter">
                        {formatPrice(size === 'small' ? pizza.smallPrice : pizza.largePrice, currency, exchangeRate, pizza.priceCurrency as "LBP" | "USD").replace('LBP', '').trim()}
                    </div>
                    {/* Placeholder for price, if needed for skeleton state, but currently always shows price */}
                    {/* <div className="h-4 bg-white/10 rounded w-20 ml-4"></div> */}
                </div>
            </div>
        </div>
    );
};

export const SkeletonPizza: React.FC = () => (
    <div className="group flex flex-col gap-4 p-5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[1.5rem] border border-white/5 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
            </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="px-5 py-2 rounded-xl text-xs font-black bg-white/10 w-16 h-8"></div>
                <div className="px-5 py-2 rounded-xl text-xs font-black bg-white/5 w-16 h-8 ml-1"></div>
            </div>
            <div className="flex flex-col items-end">
                <div className="h-8 bg-white/10 rounded w-20"></div>
            </div>
        </div>
    </div>
);

const MenuPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const { language, currency, exchangeRate } = useMenu();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, itemsRes] = await Promise.all([
                    fetch('/.netlify/functions/api/categories'),
                    fetch('/.netlify/functions/api/items')
                ]);

                const cats = await catsRes.json();
                const menuItems = await itemsRes.json();

                if (Array.isArray(cats)) {
                    setCategories(cats);
                }
                if (Array.isArray(menuItems)) {
                    setItems(menuItems);
                }
            } catch (err) {
                console.error("Error loading menu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const availableItems = items.filter(i => i.isAvailable);
    const transformedItems = availableItems; // Database is now seeded correctly

    const categoryMap = {
        manaqish: categories.find(c => c.nameAr === 'مناقيش')?._id || '',
        pizza: categories.find(c => c.nameAr === 'بيتزا')?._id || '',
        sub: categories.find(c => c.nameAr === 'ساب')?._id || '',
        pastries: categories.find(c => c.nameAr === 'معجنات')?._id || '',
        sweet: categories.find(c => c.nameAr === 'صار فيك تتحلا عنا')?._id || '',
        drinks: categories.find(c => c.nameAr === 'مرطبات')?._id || '',
    };

    const getItemsByCategory = (categoryId: string) => {
        if (categoryId === 'all') return transformedItems;
        return transformedItems.filter(item => item.categoryId === categoryId);
    };

    // Pizza specific grouping
    const pizzaItems = getItemsByCategory(categoryMap.pizza || '');
    const pizzas = pizzaItems.reduce((acc: Record<string, { name: string, nameAr: string, smallPrice: number, largePrice: number, priceCurrency: 'USD' | 'LBP' }>, item: Item) => {
        const isLarge = item.nameAr.includes('كبير');
        const baseNameAr = item.nameAr.replace(' صغير', '').replace(' كبير', '');
        const baseNameEn = item.name.replace(' (Small)', '').replace(' (Large)', '');

        if (!acc[baseNameAr]) {
            acc[baseNameAr] = { name: baseNameEn, nameAr: baseNameAr, smallPrice: 0, largePrice: 0, priceCurrency: item.priceCurrency };
        }
        if (isLarge) {
            acc[baseNameAr].largePrice = item.price;
        } else {
            acc[baseNameAr].smallPrice = item.price;
        }
        acc[baseNameAr].priceCurrency = item.priceCurrency; // Ensure it matches
        return acc;
    }, {} as Record<string, { name: string, nameAr: string, smallPrice: number, largePrice: number, priceCurrency: 'USD' | 'LBP' }>);
    if (loading) return (
        <div className="relative">
            <MenuSkeleton />
            <div className="fixed inset-0 flex flex-col items-center justify-center z-[60] bg-black/20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 bg-zinc-950/80 p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="text-2xl font-bold tracking-[0.3em] uppercase animate-pulse text-white">Loading...</div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-stone-300 font-bold tracking-widest uppercase text-base">
                            Powered by Mr Kabalan
                        </div>
                        <div className="text-stone-500 font-bold tracking-widest text-base">
                            +961 3 562 190
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-24 chalkboard-bg text-stone-100 font-en relative overflow-x-hidden">
            {/* Master Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/5 pt-4 pb-4 px-4 text-center">
                <div className="container mx-auto max-w-7xl relative px-4 text-center flex flex-col items-center">
                    {/* Big Prominent Logo */}
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-white/5 blur-[60px] rounded-full"></div>
                        <img
                            src="/logo_ASSILL.jpeg"
                            alt="فرن الأصيل"
                            className="w-full max-w-[150px] sm:max-w-[220px] md:max-w-[380px] lg:max-w-[420px] h-auto object-contain rounded-[1.5rem] border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.05)] relative z-10 mx-auto bg-black"
                        />
                    </div>

                    {/* Branding Info */}
                    <div className="mt-4 flex flex-col items-center gap-3">
                        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                            <div className="border border-white/20 px-4 py-1.5 rounded-full font-bold text-white/60 text-[9px] md:text-xs tracking-[0.3em] uppercase bg-black/40 backdrop-blur-md">
                                24 / 24
                            </div>
                            <div className="flex items-center gap-3 text-white/40 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                                <Bike size={18} className="text-white/20" />
                                <span>Free Delivery</span>
                                <div className="w-px h-3 bg-white/10 mx-1"></div>
                                <a
                                    href="https://wa.me/96109543933"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#25D366] hover:text-[#20ba59] transition-colors"
                                >
                                    <Phone size={18} />
                                    <span className="hidden sm:inline">Order</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content overlap with fixed header */}
            <div className="h-[115px] sm:h-[135px] md:h-[240px] lg:h-[260px]"></div>

            {/* Category Nav - Mobile Only - Fixed below header */}
            <div className="md:hidden fixed top-[115px] left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 font-ar">
                <CategoryList
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />
            </div>

            {/* Mobile spacer for fixed categories */}
            <div className="md:hidden h-[60px]"></div>

            {/* Menu Sections Grid */}
            <main className="container mx-auto px-4 max-w-7xl">
                {activeCategory === 'all' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">

                        {/* Right Column in Arabic -> Will visually be first in RTL if we used RTL on grid, but we'll manually order it: 
                            Visually the user wants Manaqish on Right. 
                            In LTR grid, [Col 1, Col 2, Col 3]. If we want Manaqish on Right, it's Col 3.
                            But for mobile stacking, we want Manaqish first. Let's use flex-col on mobile, and order classes.
                        */}

                        {/* Column 1: Pastries (Left) */}
                        <div className="order-3 md:order-1 space-y-10">
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold font-ar text-center mb-6 text-white pb-4 border-b border-white/10 uppercase tracking-widest">
                                    معجنات
                                </h2>
                                <div className="space-y-1">
                                    {getItemsByCategory(categoryMap.pastries || '').map((item: Item) => (
                                        <MenuItem key={item._id} {...item} />
                                    ))}
                                </div>
                            </section>
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold font-ar text-center mb-6 text-white pb-4 border-b border-white/10 uppercase tracking-widest bg-white/5 py-2 rounded-lg mt-8">
                                    صار فيك تتحلا عنا
                                </h2>
                                <div className="space-y-1">
                                    {getItemsByCategory(categoryMap.sweet || '').map((item: Item) => (
                                        <MenuItem key={item._id} {...item} />
                                    ))}
                                </div>
                            </section>

                            {/* Extras block matching picture for mobile stack order, but on desktop it's bottom left */}
                            <div className="pt-8">
                                <div className="glass-card-dark rounded-2xl p-6 text-center border-2 border-white/20">
                                    <h3 className="font-ar font-bold text-xl mb-4 text-white">إضافات</h3>
                                    <div className="flex justify-between items-center text-lg mb-3">
                                        <span className="font-en font-bold">ADD EXTRA</span>
                                        <span className="font-bold tabular-nums text-white">50.000</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-ar font-bold text-stone-300">عجين أسمر للريجيم</span>
                                        <span className="font-bold tabular-nums text-white">50.000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Pizza, Sub, Drinks (Middle) */}
                        <div className="order-2 md:order-2 space-y-10">
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold font-ar text-center mb-6 text-white pb-4 border-b border-white/10 uppercase tracking-widest whitespace-normal">
                                    بيتزا
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.values(pizzas).map((pizza, idx) => (
                                        <PizzaItem key={idx} pizza={pizza} currency={currency} exchangeRate={exchangeRate} />
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl md:text-2xl font-bold font-ar text-center mb-4 text-white pb-2 border-b border-white/10 uppercase tracking-widest mt-12 whitespace-normal">
                                    ساب
                                </h2>
                                <div className="space-y-1">
                                    {getItemsByCategory(categoryMap.sub || '').map((item: Item) => (
                                        <MenuItem key={item._id} {...item} />
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white/5 rounded-2xl p-6 mt-12 overflow-hidden">
                                <h2 className="text-2xl md:text-3xl font-bold font-ar text-center mb-6 text-white pb-4 border-b border-white/10 uppercase tracking-widest">
                                    مرطبات
                                </h2>
                                <div className="space-y-1">
                                    {getItemsByCategory(categoryMap.drinks || '').map((item: Item) => (
                                        <MenuItem key={item._id} {...item} />
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Column 3: Manaqish (Right) */}
                        <div className="order-1 md:order-3">
                            <h2 className="text-3xl md:text-4xl font-bold font-ar text-center mb-8 text-white pb-4 border-b border-white/20 uppercase tracking-widest whitespace-normal">
                                مناقيش
                            </h2>
                            {getItemsByCategory(categoryMap.manaqish || '').map((item: Item) => (
                                <MenuItem key={item._id} {...item} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-1 animate-in fade-in duration-300">
                        {activeCategory === categoryMap.pizza ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.values(pizzas).map((pizza, idx) => (
                                        <PizzaItem key={idx} pizza={pizza} currency={currency} exchangeRate={exchangeRate} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            getItemsByCategory(activeCategory).map((item: Item) => (
                                <MenuItem key={item._id} {...item} />
                            ))
                        )}

                        {getItemsByCategory(activeCategory).length === 0 && activeCategory !== categoryMap.pizza && (
                            <div className="text-center py-16 text-stone-500">
                                <div className="text-5xl mb-3 opacity-50">🍽️</div>
                                {language === 'en' ? 'No items found' : 'لا يوجد عناصر'}
                            </div>
                        )}
                    </div>
                )}

                {/* Extra Add-ons */}
                <div className="mt-16 mb-8 flex flex-wrap justify-center gap-6 md:gap-12">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-center p-4 bg-white/5 animate-pulse-subtle">
                        <span className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">ADD</span>
                        <span className="text-lg md:text-xl font-bold text-white leading-tight">EXTRA</span>
                        <div className="h-px w-8 bg-white/20 my-2"></div>
                        <span className="text-sm md:text-md font-bold text-stone-300">50.000</span>
                    </div>

                    <div className="w-44 h-44 md:w-52 md:h-52 rounded-full border-2 border-white/20 flex flex-col items-center justify-center text-center p-6 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <span className="text-xl md:text-2xl font-bold font-ar text-white/90 leading-tight mb-2">عجين أسمر<br />للريجيم</span>
                        <div className="h-px w-12 bg-white/20 my-2"></div>
                        <span className="text-lg md:text-xl font-bold text-stone-200">50.000</span>
                    </div>
                </div>
            </main>

            <CurrencyToggle />
            <OfferPopup />
        </div>
    );
};

export default MenuPage;
