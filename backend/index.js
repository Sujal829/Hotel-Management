require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const isDev = process.env.NODE_ENV !== 'production';
const allowOrigin = (origin, callback) => {
    // Allow non-browser tools (no Origin header)
    if (!origin) return callback(null, true);

    if (!isDev) {
        const allowed = process.env.FRONTEND_URL;
        return callback(null, origin === allowed);
    }

    // Dev: allow localhost Vite port changes
    const isLocal =
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

    return callback(null, isLocal);
};

const io = socketIo(server, {
    cors: {
        origin: allowOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: allowOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Store io in app to use in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/tables', require('./routes/table'));
app.use('/api/profile', require('./routes/profile'));

// Serve Uploads
app.use('/uploads', express.static('uploads'));

// Socket handle
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
