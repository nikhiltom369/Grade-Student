const express = require('express');
const session = require('express-session');
const path = require('path');

// Initialize App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static HTML and JS

// Session Config
app.use(session({
    secret: 'student-grade-system-secret-key-12345',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // set to true if using https
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// API Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Default redirect for root
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
