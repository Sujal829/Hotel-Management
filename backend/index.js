require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const fs = require('fs');

// Log essential config check
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnv.forEach(env => {
    if (!process.env[env]) {
        console.warn(`WARNING: Missing environment variable: ${env}`);
    } else {
        console.log(`CONFIG: ${env} is set`);
    }
});

const app = express();
const server = http.createServer(app);

const isDev = process.env.NODE_ENV !== 'production';
const allowOrigin = (origin, callback) => {
    // Allow non-browser tools (no Origin header)
    if (!origin) return callback(null, true);

    // Standardize origin by removing trailing slash
    const cleanOrigin = origin.replace(/\/$/, '');

    if (!isDev) {
        const allowed = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        // Explicitly allow the primary Vercel domain as a fallback
        const isVercel = cleanOrigin === 'https://hotel-management-mu-blush.vercel.app' || cleanOrigin === allowed;
        return callback(null, isVercel);
    }

    // Dev: allow localhost Vite port changes
    const isLocal =
        /^http:\/\/localhost:\d+$/.test(cleanOrigin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(cleanOrigin);

    return callback(null, isLocal);
};

const io = socketIo(server, {
    cors: {
        origin: allowOrigin,
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['websocket', 'polling'], // Explicitly support both for better connectivity
    allowEIO3: true // Support older engine.io versions if necessary
});

// Connect to Database
connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Cloudinary/external images
app.use(cors({
    origin: allowOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // 200 requests per IP
    message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Store io in app to use in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/tables', require('./routes/table'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/qr', require('./routes/qr'));

// Serve Uploads
app.use('/uploads', express.static('uploads'));

// Production Frontend Serving
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../frontend/dist');
    if (fs.existsSync(distPath)) {
        console.log(`PRODUCTION: Serving frontend from ${distPath}`);
        app.use(express.static(distPath));
        app.use((req, res) => {
            res.sendFile(path.resolve(distPath, 'index.html'));
        });
    } else {
        console.warn(`WARNING: Frontend dist folder not found at ${distPath}. Skipping static serving.`);
    }
}

// Socket handle
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_admin', (adminId) => {
        if (adminId) {
            socket.join(adminId.toString());
            console.log(`Admin joined room: ${adminId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port) => {
    server.listen(port, () => console.log(`Server running on port ${port}`));
};

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying next port...`);
        const fallbackPort = PORT + 1;
        server.close(() => {
            server.listen(fallbackPort, () => console.log(`Server running on fallback port ${fallbackPort}`));
        });
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

startServer(PORT);
