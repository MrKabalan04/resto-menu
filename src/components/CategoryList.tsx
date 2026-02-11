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
        <div className="py-4 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
            <div className="flex px-4 gap-3 min-w-max">
                <button
                    onClick={() => onSelect('all')}
                    className={`
                px-4 py-2 rounded-full whitespace-nowrap transition-colors font-bold text-sm border
                ${activeCategory === 'all'
                            ? 'bg-lava text-white border-lava shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }
            `}
                >
                    All / الكل
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => onSelect(cat._id)}
                        className={`px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap text-sm border ${activeCategory === cat._id
                            ? 'bg-lava text-white border-lava shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
