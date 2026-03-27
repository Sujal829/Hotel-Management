const mongoose = require('mongoose');
const Category = require('./models/Category');
const Menu = require('./models/Menu');
const Table = require('./models/Table');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-diner';

const categories = [
    { name: 'Artisanal Brews' },
    { name: 'Curated Platters' },
    { name: 'Heritage Grains' },
    { name: 'Botanical Infusions' }
];

const dishes = [
    {
        name: 'Ochre Saffron Risotto',
        originalPrice: 850,
        discountPercentage: 10,
        categoryName: 'Heritage Grains',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Sanguine Beetroot Carpaccio',
        originalPrice: 620,
        discountPercentage: 0,
        categoryName: 'Curated Platters',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Smoked Amber Espresso',
        originalPrice: 320,
        discountPercentage: 5,
        categoryName: 'Artisanal Brews',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Spiced Lamb Lookbook',
        originalPrice: 1250,
        discountPercentage: 15,
        categoryName: 'Curated Platters',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
    }
];

const tables = [
    { number: 1, capacity: 2 },
    { number: 2, capacity: 4 },
    { number: 3, capacity: 2 },
    { number: 4, capacity: 6 },
    { number: 5, capacity: 4 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Category.deleteMany({});
        await Menu.deleteMany({});
        await Table.deleteMany({});
        await User.deleteMany({ role: 'admin' });

        // Seed Categories
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories Seeded.');

        // Seed Dishes
        const dishData = dishes.map(dish => {
            const category = createdCategories.find(c => c.name === dish.categoryName);
            return { ...dish, category: category._id };
        });
        await Menu.insertMany(dishData);
        console.log('Dishes Seeded.');

        // Seed Tables
        await Table.insertMany(tables);
        console.log('Tables Seeded.');

        // Seed Admin User
        await User.create({
            name: 'Julian Escoffier',
            mobile: '9876543210',
            email: 'admin@zestful.com',
            role: 'admin',
            avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200'
        });
        console.log('Admin User Seeded.');

        console.log('Database Seeding Completed Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();
