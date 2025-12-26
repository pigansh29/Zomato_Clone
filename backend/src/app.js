// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://zomato-clone-anab.vercel.app"];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is in the allowed list
        // We compare exactly, but we also check if the allowed list contains the origin without a trailing slash (if it has one)
        const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf(normalizedOrigin) !== -1) {
            return callback(null, true);
        }

        console.error(`CORS Error: Origin ${origin} not allowed`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.use('/videos', express.static(path.join(__dirname, '../../vdeos')));

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;