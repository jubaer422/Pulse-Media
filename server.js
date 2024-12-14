const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session setup
app.use(session({
    secret: 'your-secret-key', 
    resave: false, 
    saveUninitialized: true
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pulse_media'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// API for user registration
app.post('/api/register', (req, res) => {
    const { name, phone, email, password } = req.body;
    const query = `INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)`;

    db.query(query, [name, phone, email, password], (err, result) => {
        if (err) {
            res.status(500).send('Error registering user.');
            return;
        }
        res.send('Registration successful!');
    });
});

// API for user login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.query(query, [email, password], (err, result) => {
        if (err || result.length === 0) {
            res.status(401).send('Invalid email or password.');
            return;
        }

        // Store user info in session
        req.session.user = result[0];
        res.send('Login successful!');
    });
});

// API for fetching user profile
app.get('/api/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Not logged in.');
    }
    res.json(req.session.user);
});

// API for updating user profile
app.put('/api/update-profile', (req, res) => {
    const { id, name, phone, password } = req.body;
    const query = `UPDATE users SET name = ?, phone = ?, password = ? WHERE id = ?`;

    db.query(query, [name, phone, password, id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating profile.');
            return;
        }
        // Update session data with new profile info
        req.session.user = { ...req.session.user, name, phone, password };
        res.send('Profile updated successfully!');
    });
});

// Logout API
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out.');
        }
        res.send('Logged out successfully.');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
