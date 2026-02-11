import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from './models/Category';
import { MenuItem } from './models/MenuItem';
import { Settings } from './models/Settings';
import { Admin } from './models/Admin';

dotenv.config();

const categoriesData = [
    { name: 'Appetizer', order: 1 },
    { name: 'Fa7em', order: 2 },
    { name: 'Platers', order: 3 },
    { name: 'Crispy Meals', order: 4 },
    { name: 'Broasted', order: 5 },
    { name: 'Seafood', order: 6 },
    { name: 'Zinger', order: 7 },
    { name: 'Burger', order: 8 },
    { name: 'Sandwiches', order: 9 },
    { name: 'Crepe & Waffle', order: 10 },
    { name: 'Cocktail', order: 11 },
    { name: 'Drinks', order: 12 },
    { name: 'Extra', order: 13 },
    { name: 'Pizza', order: 14 },
];

const itemsData = [
    // Burger
    { cat: 'Burger', name: 'Classic Beef', nameAr: 'لحمة كلاسيكية', price: 5.5 },
    { cat: 'Burger', name: 'Cheese Burger', nameAr: 'برغر الجبن', price: 5.5 },
    { cat: 'Burger', name: 'Beef Bacon Cheese', nameAr: 'بيكون تشيز برغر', price: 6 },
    { cat: 'Burger', name: 'Mushroom & Swiss', nameAr: 'مشروم برغر', price: 6.75 },
    { cat: 'Burger', name: 'Beef Mozzarella', nameAr: 'موزاريلا برغر', price: 6.75 },
    { cat: 'Burger', name: 'BBQ Burger', nameAr: 'باربيكيو برغر', price: 6 },
    { cat: 'Burger', name: 'Lava Burger', nameAr: 'لافا برغر', price: 7.25 },
    { cat: 'Burger', name: 'Lebanese Burger', nameAr: 'برغر لبنانية', price: 5 },
    { cat: 'Burger', name: 'Classic Chicken', nameAr: 'كلاسيك شيكن', price: 5 },
    { cat: 'Burger', name: 'Chicken Honey Mustard', nameAr: 'شيكن هوني مسترد', price: 5 },
    { cat: 'Burger', name: 'Chicken Mozzarella', nameAr: 'شيكن موزاريلا', price: 6 },
    { cat: 'Burger', name: 'Escalope Burger', nameAr: 'اسكالوب برغر', price: 4.5 },

    // Sandwiches
    { cat: 'Sandwiches', name: 'Grilled Chicken Sandwich', nameAr: 'ساندويش دجاج مشوي', price: 5.5 },
    { cat: 'Sandwiches', name: 'Crispy Supreme', nameAr: 'كريسبى سوبريم', price: 5.5 },
    { cat: 'Sandwiches', name: 'BBQ Chicken', nameAr: 'شيكن باربيكيو', price: 5.5 },
    { cat: 'Sandwiches', name: 'Spicy Steak', nameAr: 'ستيك حارة', price: 5.5 },
    { cat: 'Sandwiches', name: 'Steak Sandwich', nameAr: 'ساندويش ستيك', price: 5 },
    { cat: 'Sandwiches', name: 'Chinese', nameAr: 'شاينيز', price: 4.5 },
    { cat: 'Sandwiches', name: 'Shrimp', nameAr: 'جمبري', price: 5.5 },
    { cat: 'Sandwiches', name: 'Hawsa', nameAr: 'هاوسا', price: 5 },
    { cat: 'Sandwiches', name: 'Chicken Supreme', nameAr: 'شيكن سوبريم', price: 5 },
    { cat: 'Sandwiches', name: 'Cream Steak', nameAr: 'كريم ستيك', price: 5.5 },
    { cat: 'Sandwiches', name: 'Cream Chicken', nameAr: 'كريم شيكن', price: 5 },
    { cat: 'Sandwiches', name: 'Escalope Sand', nameAr: 'اسكالوب ساند', price: 5 },
    { cat: 'Sandwiches', name: 'Twister', nameAr: 'تويستر', price: 5 },
    { cat: 'Sandwiches', name: 'Fajita', nameAr: 'فاهيتا', price: 5.5 },
    { cat: 'Sandwiches', name: 'Fahita Cassadia', nameAr: 'فاهيتا كاساديا', price: 6 },
    { cat: 'Sandwiches', name: 'Crispy', nameAr: 'كرسبي', price: 4.5 },
    { cat: 'Sandwiches', name: 'Twister BBQ', nameAr: 'تويستر باربيكيو', price: 5 },
    { cat: 'Sandwiches', name: 'BBQ Crispy', nameAr: 'باربيكيو كرسبي', price: 5 },
    { cat: 'Sandwiches', name: 'Twister Supreme', nameAr: 'تويستر سوبريم', price: 6 },
    { cat: 'Sandwiches', name: 'Crunchy Twister', nameAr: 'كرانشي تويستر', price: 5.5 },
    { cat: 'Sandwiches', name: 'Potato Sandwich', nameAr: 'ساندويش بطاطا', price: 2.25 },
    { cat: 'Sandwiches', name: 'Chicken Sub', nameAr: 'شيكن ساب', price: 4.5 },
    { cat: 'Sandwiches', name: 'Philadelphia', nameAr: 'فيلادلفيا', price: 6.75 },
    { cat: 'Sandwiches', name: 'Big Filler', nameAr: 'بيغ فيلير', price: 6 },
    { cat: 'Sandwiches', name: 'Lava Master', nameAr: 'لافا ماستر', price: 6 },
    { cat: 'Sandwiches', name: 'Twister Xstream', nameAr: 'تويستر اكستريم', price: 12.25 }, // "2 Twister - Fries - Cole Slow"
    { cat: 'Sandwiches', name: 'Chicken Ceaser Wrap', nameAr: 'شيكن سيزر وراب', price: 5.5 },
    { cat: 'Sandwiches', name: 'Shawarma Sandwich', nameAr: 'ساندويش شاورما', price: 3.25 },

    // Appetizer
    { cat: 'Appetizer', name: 'Fries', nameAr: 'بطاطا', price: 2.75 },
    { cat: 'Appetizer', name: 'Large Fries', nameAr: 'بطاطا كبيرة', price: 4.5 },
    { cat: 'Appetizer', name: 'Loaded Fries', nameAr: 'بطاطس مقلية', price: 5.5 },
    { cat: 'Appetizer', name: 'Curly Fries', nameAr: 'بطاطس كيرلي', price: 3.5 },
    { cat: 'Appetizer', name: 'Cheese Fries', nameAr: 'بطاطس بالجبن', price: 4.5 },
    { cat: 'Appetizer', name: 'Large Cheese Fries', nameAr: 'بطاطا بالجبنة كبيرة', price: 5.5 },
    { cat: 'Appetizer', name: 'Crispy Fries 3 Pcs', nameAr: 'قطع بطاطس كرسبي 3', price: 6.5 },
    { cat: 'Appetizer', name: 'Go Combo', nameAr: 'كومبو', price: 3.25 },
    { cat: 'Appetizer', name: 'Cole Slow', nameAr: 'كول سلو', price: 0.5 },
    { cat: 'Appetizer', name: 'Wedges', nameAr: 'ويدجز', price: 4.5 },
    { cat: 'Appetizer', name: 'Mozzarella Sticks', nameAr: 'موزاريلا ستيكس', price: 4 },
    { cat: 'Appetizer', name: 'BBQ Wings 10 Pcs', nameAr: 'قطع باربيكيو وينجز 10', price: 6 },
    { cat: 'Appetizer', name: 'Buffalo Wings 10 Pcs', nameAr: 'بوفالو', price: 6 },
    { cat: 'Appetizer', name: 'Wings Mix BBQ & Buffalo', nameAr: 'وينجز', price: 6 },

    // Pizza
    { cat: 'Pizza', name: 'Margarita', nameAr: 'بيتزا مارغريتا', price: 800000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Vegetarian', nameAr: 'بيتزا خضار', price: 800000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Peperoni', nameAr: 'بيتزا بيبروني', price: 900000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Chicken BBQ Ranch', nameAr: 'بيتزا دجاج باربيكيو', price: 1000000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Sojouk', nameAr: 'بيتزا سجق', price: 900000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Martadella', nameAr: 'بيتزا مرتديلا', price: 900000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: '7abash', nameAr: 'بيتزا حبش', price: 900000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Truffle', nameAr: 'بيتزا ترافل', price: 950000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: '4 cheese', nameAr: 'بيتزا 4 أجبان', price: 950000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Hotdog Crunchy Bbq', nameAr: 'بيتزا هوت دوغ', price: 950000, priceCurrency: 'LBP' },
    { cat: 'Pizza', name: 'Extra Ranch', nameAr: 'إضافة رانش', price: 45000, priceCurrency: 'LBP' },

    // Crepe & Waffle
    { cat: 'Crepe & Waffle', name: 'Crepe Nutella', nameAr: 'نيوتيلا كريب', price: 4 },
    { cat: 'Crepe & Waffle', name: 'Crepe Kinder', nameAr: 'كندر كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Oreo', nameAr: 'أوريو كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Lutos', nameAr: 'لوتس كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Mars', nameAr: 'مارس كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Twix', nameAr: 'تويكس كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Brownie', nameAr: 'براوني كريب', price: 4.5 },
    { cat: 'Crepe Kitkat', nameAr: 'كيت كات كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Snickers', nameAr: 'سنيكرز كريب', price: 4.5 },
    { cat: 'Crepe & Waffle', name: 'Crepe Sushi', nameAr: 'سوشي كريب', price: 7.25 },
    { cat: 'Crepe & Waffle', name: 'Crepe Fettuccine', nameAr: 'فيتوتشيني كريب', price: 5 },

    // Cocktail
    { cat: 'Cocktail', name: 'She2af Large', nameAr: 'شقف كبير', price: 5 },
    { cat: 'Cocktail', name: 'She2af Medium', nameAr: 'شقف وسط', price: 4 },
    { cat: 'Cocktail', name: 'Avocado', nameAr: 'افوكادو', price: 5 },
    { cat: 'Cocktail', name: 'Juice Orange', nameAr: 'برتقال', price: 2.25 },
    { cat: 'Cocktail', name: 'Juice Makhfouz', nameAr: 'مخفوق', price: 2.75 },
    { cat: 'Cocktail', name: 'Juice Carrot', nameAr: 'جزر', price: 2.75 },
    { cat: 'Cocktail', name: 'Juice Strawberry', nameAr: 'فراولة', price: 2.75 },

    // Drinks
    { cat: 'Drinks', name: 'Pepsi 330ml', nameAr: 'بيبسي', price: 1 },
    { cat: 'Drinks', name: 'Pepsi 1.25L', nameAr: 'بيبسي 1.25', price: 1.25 },
    { cat: 'Drinks', name: 'Pepsi Jumbo', nameAr: 'بيبسي جامبو', price: 2.25 },
    { cat: 'Drinks', name: 'Laban', nameAr: 'لبن', price: 1 },
    { cat: 'Drinks', name: 'Water Small', nameAr: 'ماء صغير', price: 0.25 },
    { cat: 'Drinks', name: 'Water Large', nameAr: 'ماء كبير', price: 0.75 },

    // Fa7em
    { cat: 'Fa7em', name: 'Farouj Meal', nameAr: 'وجبة فروج', price: 14.5 }, // "Fries / Homos / Garlic"
    { cat: 'Fa7em', name: 'Sandwich Djej', nameAr: 'ساندويش دجاج', price: 4 },
    { cat: 'Fa7em', name: 'Sandwich Tawook', nameAr: 'ساندويش طاووق', price: 4 },
    { cat: 'Fa7em', name: 'Nos Farouj - Fries', nameAr: 'نص فروج - بطاطس', price: 7.75 },
    { cat: 'Fa7em', name: 'Sandwich Lahme Ftile', nameAr: 'ساندويش لحمة فتيلة', price: 4 },
    { cat: 'Fa7em', name: 'Kafta', nameAr: 'كفتة', price: 4 },
    { cat: 'Fa7em', name: 'Wajbet Mashewe', nameAr: 'وجبة مشاوي', price: 9.5 },
    { cat: 'Fa7em', name: 'Kilo Mashewe Tshakal', nameAr: 'كيلو مشاوي مشكل', price: 39 },

    // Platers
    { cat: 'Platers', name: 'Escaloppe', nameAr: 'اسكالوب', price: 8.25 },
    { cat: 'Platers', name: 'Boneless Chicken', nameAr: 'بونلس شيكن', price: 9 },
    { cat: 'Platers', name: 'Fettuccine Alfredo', nameAr: 'فيتوتشيني الفريدو', price: 10 },
    { cat: 'Platers', name: 'Tawook Platter', nameAr: 'طبق طاووق', price: 8.25 },

    // Crispy Meals
    { cat: 'Crispy Meals', name: 'Mini Box Crispy 3 Pcs', nameAr: 'ميني بوكس كرسبي 3', price: 7.25 },
    { cat: 'Crispy Meals', name: 'Crispy Strips 5 Pcs', nameAr: 'كرسبي ستربس 5', price: 8.25 },
    { cat: 'Crispy Meals', name: 'Double Crispy Box 10 Pcs', nameAr: 'دوبل كرسبي بوكس 10', price: 15.5 },
    { cat: 'Crispy Meals', name: '8 Pcs Crispy', nameAr: 'قطع كرسبي 8', price: 13.25 },
    { cat: 'Crispy Meals', name: '16 Pcs Crispy', nameAr: 'قطعة كرسبي 16', price: 22.25 },

    // Broasted
    { cat: 'Broasted', name: 'Snack Box 2 Pcs', nameAr: 'سناك بوكس 2', price: 6 },
    { cat: 'Broasted', name: 'Lunch Box 3 Pcs', nameAr: 'لانش بوكس 3', price: 7.25 },
    { cat: 'Broasted', name: 'Dinner Meal 4 Pcs', nameAr: 'وجبة عشاء 4', price: 8.25 },
    { cat: 'Broasted', name: 'Value Meal 9 Pcs', nameAr: 'وجبة 9 قطع', price: 14.5 },
    { cat: 'Broasted', name: 'Family Meal 12 Pcs', nameAr: 'وجبة عائلية 12', price: 19 },
    { cat: 'Broasted', name: 'Bucket Meal 15 Pcs', nameAr: 'وجبة باكيت 15', price: 24.5 },
    { cat: 'Broasted', name: 'Mixata Box', nameAr: 'ميكساتا بوكس', price: 27.75 }, // 9 Broasted, 10 Crispy..
    { cat: 'Broasted', name: 'Super Box', nameAr: 'سوبر بوكس', price: 36.75 },

    // Seafood
    { cat: 'Seafood', name: 'Shrimp Meal 15 Pcs', nameAr: 'وجبة قريدس 15', price: 8.5 },
    { cat: 'Seafood', name: 'Fish Sandwich', nameAr: 'ساندويش سمك', price: 5 },
    { cat: 'Seafood', name: 'Shrimp Pane Sandwich', nameAr: 'ساندويش قريدس بانيه', price: 5.5 },

    // Zinger
    { cat: 'Zinger', name: 'Zinger', nameAr: 'زنجر', price: 5.5 },
    { cat: 'Zinger', name: 'Zinger Mozzarella', nameAr: 'زنجر موزاريلا', price: 6.5 },
    { cat: 'Zinger', name: 'Zinger Spicy', nameAr: 'زنجر سبايسي', price: 5.55 },
    { cat: 'Zinger', name: 'Zinger Crunchy', nameAr: 'زنجر كرانشي', price: 6 },
    { cat: 'Zinger', name: 'Zinger Supreme', nameAr: 'زنجر سوبريم', price: 6 },
    { cat: 'Zinger', name: 'Zinger Mighty', nameAr: 'زنجر مايتي', price: 7.75 },
    { cat: 'Zinger', name: 'Zinger Lava', nameAr: 'زنجر لافا', price: 7.25 },

    // Extra
    { cat: 'Extra', name: 'Mozarella Patty', nameAr: 'موزاريلا', price: 1 },
    { cat: 'Extra', name: 'Turkey (7abash)', nameAr: 'حبش', price: 0.5 },
    { cat: 'Extra', name: 'Sauce', nameAr: 'صوص', price: 0.5 },
    { cat: 'Extra', name: 'Cheddar', nameAr: 'شيدر', price: 0.5 },
    { cat: 'Extra', name: 'Garlic Small', nameAr: 'ثوم صغير', price: 0.3 },
    { cat: 'Extra', name: 'Garlic Large', nameAr: 'ثوم كبير', price: 0.6 },
    { cat: 'Extra', name: 'Shisha', nameAr: 'ارغيلة', price: 4 },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Clear existing
        await Category.deleteMany({});
        await MenuItem.deleteMany({});
        await Admin.deleteMany({});

        await Settings.findOneAndUpdate({}, { restaurantName: 'Lava Resto', lbpRate: 89500 }, { upsert: true });
        await Admin.findOneAndUpdate({ username: 'admin' }, { password: 'admin123' }, { upsert: true });

        // Seed Categories
        const categoryMap = new Map();
        for (const cat of categoriesData) {
            const newCat = await Category.create({ name: cat.name, nameAr: cat.name, order: cat.order });
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
                nameAr: item.nameAr || item.name, // Fallback if no arabic provided
                description: '',
                descriptionAr: '',
                price: item.price,
                priceCurrency: (item as any).priceCurrency || 'USD',
                isAvailable: true
            });
        }

        console.log('Seeding Completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
