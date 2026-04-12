const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-diner');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('CRITICAL: MongoDB Connection Failed');
        console.error(err.message);
        // Removed process.exit(1) so the app stays alive and we can see logs on Render
    }
};

module.exports = connectDB;
