const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(__dirname)); // Serve static files from current directory

const DATA_FILE = path.join(__dirname, 'data.json');
const IMAGES_DIR = path.join(__dirname, 'images', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Auth Middleware (Simple token check)
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token && token.startsWith('session_valid_')) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// API Routes

// Get all data
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading data' });
        res.json(JSON.parse(data));
    });
});

// Add Portfolio Item
app.post('/api/portfolio', authenticate, (req, res) => {
    const { title, category, location } = req.body;
    let imagePath = '';

    if (req.files && req.files.image) {
        const image = req.files.image;
        const fileName = `${Date.now()}_${image.name}`;
        imagePath = `images/uploads/${fileName}`;
        image.mv(path.join(__dirname, imagePath));
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        const json = JSON.parse(data);
        const newItem = {
            id: json.portfolio.length + 1,
            title,
            category,
            location,
            image: imagePath || 'images/portfolio/placeholder.png'
        };
        json.portfolio.unshift(newItem); // Add to beginning
        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 4), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving data' });
            res.json({ success: true, item: newItem });
        });
    });
});

// Add Event
app.post('/api/events', authenticate, (req, res) => {
    const { title, type, date, location, description } = req.body;
    let imagePath = '';

    if (req.files && req.files.image) {
        const image = req.files.image;
        const fileName = `${Date.now()}_${image.name}`;
        imagePath = `images/uploads/${fileName}`;
        image.mv(path.join(__dirname, imagePath));
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        const json = JSON.parse(data);
        const newEvent = {
            id: json.events.length + 1,
            title,
            type,
            date,
            location,
            description,
            image: imagePath || 'images/generated/placeholder_event.png'
        };
        json.events.unshift(newEvent);
        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 4), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving data' });
            res.json({ success: true, event: newEvent });
        });
    });
});

// Delete Portfolio Item
app.delete('/api/portfolio/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        const json = JSON.parse(data);
        json.portfolio = json.portfolio.filter(item => item.id !== id);
        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 4), (err) => {
            if (err) return res.status(500).json({ error: 'Error deleting item' });
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin Login: http://localhost:${PORT}/login.html`);
});
