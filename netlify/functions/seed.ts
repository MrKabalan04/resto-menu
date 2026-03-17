import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from './models/Category';
import { MenuItem } from './models/MenuItem';
import { Settings } from './models/Settings';
import { Admin } from './models/Admin';

dotenv.config();

const categoriesData = [
    { name: 'Manaqish', nameAr: 'مناقيش', order: 1 },
    { name: 'Pizza', nameAr: 'بيتزا', order: 2 },
    { name: 'Sub', nameAr: 'ساب', order: 3 },
    { name: 'Pastries', nameAr: 'معجنات', order: 4 },
    { name: 'Sweets', nameAr: 'صار فيك تتحلا عنا', order: 5 },
    { name: 'Drinks', nameAr: 'مرطبات', order: 6 },
];

const itemsData = [
    // ===== مناقيش - Manaqish =====
    { cat: 'Manaqish', name: 'Zaatar', nameAr: 'زعتر', price: 70000 },
    { cat: 'Manaqish', name: 'Zaatar Extra', nameAr: 'زعتر اكسترا', price: 100000 },
    { cat: 'Manaqish', name: 'Cheese', nameAr: 'جبنة', price: 200000 },
    { cat: 'Manaqish', name: 'Zaatar Machrouha', nameAr: 'زعتر مشروحة', price: 100000 },
    { cat: 'Manaqish', name: 'Zaatar with Cheese', nameAr: 'زعتر مع جبنة', price: 170000 },
    { cat: 'Manaqish', name: 'Zaatar with Labne', nameAr: 'زعتر مع لبنة', price: 120000 },
    { cat: 'Manaqish', name: 'Cheese Machrouha', nameAr: 'جبنة مشروحة', price: 250000 },
    { cat: 'Manaqish', name: 'Kachkawen Cheese', nameAr: 'جبنة قشقوين', price: 250000 },
    { cat: 'Manaqish', name: 'Ham & Cheese', nameAr: 'جبنة وجنبون', price: 350000 },
    { cat: 'Manaqish', name: 'Cheese & Pepperoni', nameAr: 'جبنة وبيبروني', price: 350000 },
    { cat: 'Manaqish', name: 'Cheese & Sujuk', nameAr: 'جبنة وسجق', price: 350000 },
    { cat: 'Manaqish', name: 'Meat with Cheese', nameAr: 'لحمة مع جبنة', price: 350000 },
    { cat: 'Manaqish', name: 'Kafta & Cheese', nameAr: 'كفتة وجبنة', price: 350000 },
    { cat: 'Manaqish', name: 'Lahem Baajin', nameAr: 'لحمة بعجين', price: 200000 },
    { cat: 'Manaqish', name: 'Spinach', nameAr: 'سبانخ', price: 100000 },
    { cat: 'Manaqish', name: 'Zoubaa', nameAr: 'زوباع', price: 100000 },
    { cat: 'Manaqish', name: 'Keshek', nameAr: 'كشك', price: 150000 },
    { cat: 'Manaqish', name: 'Mhamra', nameAr: 'محمرة', price: 200000 },
    { cat: 'Manaqish', name: 'Egg', nameAr: 'قرص بيض', price: 120000 },
    { cat: 'Manaqish', name: 'Labneh Extra', nameAr: 'لبنة اكسترا', price: 150000 },
    { cat: 'Manaqish', name: 'Cheese Pastry (Kaak)', nameAr: 'كعك بجبنة', price: 250000 },
    { cat: 'Manaqish', name: 'BBQ Chicken', nameAr: 'دجاج صلصة الباربيكيو', price: 350000 },

    // ===== بيتزا - Pizza =====
    { cat: 'Pizza', name: 'Regular (Small)', nameAr: 'بيتزا عادية صغير', price: 600000 },
    { cat: 'Pizza', name: 'Regular (Large)', nameAr: 'بيتزا عادية كبير', price: 1100000 },
    { cat: 'Pizza', name: 'Pepperoni (Small)', nameAr: 'بيتزا بيبروني صغير', price: 600000 },
    { cat: 'Pizza', name: 'Pepperoni (Large)', nameAr: 'بيتزا بيبروني كبير', price: 1100000 },
    { cat: 'Pizza', name: 'Sujuk (Small)', nameAr: 'سجق صغير', price: 600000 },
    { cat: 'Pizza', name: 'Sujuk (Large)', nameAr: 'سجق كبير', price: 1100000 },
    { cat: 'Pizza', name: 'Chicken (Small)', nameAr: 'دجاج صغير', price: 650000 },
    { cat: 'Pizza', name: 'Chicken (Large)', nameAr: 'دجاج كبير', price: 1300000 },

    // ===== صاب - Sub =====
    { cat: 'Sub', name: 'Chicken Sub', nameAr: 'تشيكن ساب', price: 550000 },
    { cat: 'Sub', name: 'Submarine', nameAr: 'ساب مارين', price: 500000 },
    { cat: 'Sub', name: 'Egg & Cheese', nameAr: 'قرص بيض مع جبنة', price: 300000 },
    { cat: 'Sub', name: 'Egg & Awarma', nameAr: 'قرص بيض وقورما', price: 350000 },
    { cat: 'Sub', name: 'Labneh & Awarma', nameAr: 'لبنة وقورما', price: 250000 },
    { cat: 'Sub', name: 'Pesto Cheese', nameAr: 'جبنة بيستو', price: 250000 },
    { cat: 'Sub', name: 'Cheese & Awarma', nameAr: 'جبنة وقورما', price: 400000 },

    // ===== معجنات - Pastries =====
    { cat: 'Pastries', name: 'Pizza', nameAr: 'بيتزا', price: 500000 },
    { cat: 'Pastries', name: 'Meat', nameAr: 'لحمة', price: 450000 },
    { cat: 'Pastries', name: 'Cheese', nameAr: 'جبنة', price: 450000 },
    { cat: 'Pastries', name: 'Hot Dog', nameAr: 'هوت دوغ', price: 450000 },
    { cat: 'Pastries', name: 'Spinach', nameAr: 'سبانخ', price: 400000 },
    { cat: 'Pastries', name: 'Keshek', nameAr: 'كشك', price: 450000 },
    { cat: 'Pastries', name: 'Zaatar', nameAr: 'زعتر', price: 300000 },

    // ===== صار فيك تتحلا عنا - Sweets =====
    { cat: 'Sweets', name: 'Caster', nameAr: 'كاستر', price: 120000 },
    { cat: 'Sweets', name: 'Rice with Milk', nameAr: 'رز بحليب', price: 120000 },
    { cat: 'Sweets', name: 'Gelo', nameAr: 'دجيلو', price: 100000 },
    { cat: 'Sweets', name: 'Chocolate with Cheese', nameAr: 'شوكولا مع جبنة', price: 300000 },
    { cat: 'Sweets', name: 'Chocobat', nameAr: 'شوكوبات', price: 250000 },

    // ===== مرطبات - Drinks =====
    { cat: 'Drinks', name: 'Soft Drinks', nameAr: 'مشروبات غازية', price: 100000 },
    { cat: 'Drinks', name: 'Ayran Laban', nameAr: 'لبن عيران', price: 80000 },
    { cat: 'Drinks', name: 'Bonjus', nameAr: 'بون جوس', price: 30000 },
    { cat: 'Drinks', name: 'Big Water', nameAr: 'ماء كبير', price: 50000 },
    { cat: 'Drinks', name: 'Small Water', nameAr: 'ماء صغير', price: 30000 },
    { cat: 'Drinks', name: 'Fresh Lemonade', nameAr: 'ليموناضه طبيعية', price: 150000 },
    { cat: 'Drinks', name: 'Fresh Lemon', nameAr: 'ليمون طبيعي', price: 150000 },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Clear existing
        await Category.deleteMany({});
        await MenuItem.deleteMany({});
        // await Admin.deleteMany({}); // Keep admin to avoid resetting login

        await Settings.findOneAndUpdate({}, { restaurantName: 'فرن الأصيل', lbpRate: 1 }, { upsert: true });
        // We set lbpRate to 1 because prices are already in LBP in the seed data and we want to show them as is.
        // If the user wants to toggle, they can.

        await Admin.findOneAndUpdate({ username: 'admin' }, { password: 'admin123' }, { upsert: true });

        // Seed Categories
        const categoryMap = new Map();
        for (const cat of categoriesData) {
            const newCat = await Category.create({ name: cat.name, nameAr: cat.nameAr, order: cat.order });
            categoryMap.set(cat.name, newCat._id);
        }

        // Seed Items
        for (const item of itemsData) {
            if (!categoryMap.has(item.cat)) {
                console.error(`Category not found: ${item.cat}`);
                continue;
            }
            await MenuItem.create({
                categoryId: categoryMap.get(item.cat),
                name: item.name,
                nameAr: item.nameAr,
                description: '',
                descriptionAr: '',
                price: item.price,
                priceCurrency: 'LBP',
                isAvailable: true
            });
        }

        console.log('Seeding Completed - فرن الأصيل menu loaded!');
        console.log(`  Categories: ${categoriesData.length}`);
        console.log(`  Items: ${itemsData.length}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
