const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-diner');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('CRITICAL: MongoDB Connection Failed');
        console.error('Message:', err.message);
        console.error('Troubleshooting:');
        console.error('1. Check if the connection string in .env (MONGODB_URI) is correct.');
        console.error('2. Ensure your IP address (especially for Render/Server) is whitelisted in MongoDB Atlas.');
        console.error('3. Check if the database user has correct permissions.');
        
        // We don't exit the process here to allow the server to stay alive for debugging/logs on Render
    }
};

module.exports = connectDB;
