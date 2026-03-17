import React from 'react';


interface Category {
    _id: string;
    name: string;
    nameAr: string;
}

interface CategoryListProps {
    categories: Category[];
    activeCategory: string;
    onSelect: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, activeCategory, onSelect }) => {


    return (
        <div className="py-4 overflow-x-auto no-scrollbar">
            <div className="flex px-4 gap-2.5 min-w-max">
                <button
                    onClick={() => onSelect('all')}
                    className={`
                            px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm border
                            ${activeCategory === 'all'
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            : 'bg-[#1a1a1a] text-stone-400 border-stone-800 hover:bg-[#252525] hover:text-white'
                        }
                        `}
                >
                    <span className="font-en mr-1">All</span>
                    <span className="text-[10px] opacity-60 mx-1">|</span>
                    <span className="font-ar">الكل</span>
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => onSelect(cat._id)}
                        className={`px-5 py-2 rounded-full font-bold transition-all duration-300 whitespace-nowrap text-sm border flex items-center ${activeCategory === cat._id
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            : 'bg-[#1a1a1a] text-stone-400 border-stone-800 hover:bg-[#252525] hover:text-white'
                            }`}
                    >
                        <span className="font-en mr-1">{cat.name}</span>
                        <span className="text-[10px] opacity-60 mx-1">|</span>
                        <span className="font-ar">{cat.nameAr}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
