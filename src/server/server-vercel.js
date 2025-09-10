const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Use universal database that supports both SQLite and MongoDB
const db = require('../database/database-universal');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database
let dbInitialized = false;
async function ensureDB() {
    if (!dbInitialized) {
        await new Promise((resolve) => {
            db.initialize(resolve);
        });
        dbInitialized = true;
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/trend', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/trend.html'));
});

// API Routes
app.post('/api/activities', async (req, res) => {
    try {
        await ensureDB();
        
        const { type, duration, calories, heartRate, distance, timestamp } = req.body;
        
        const activity = {
            type,
            duration,
            calories,
            heartRate,
            distance: type === 'Pickleball' ? null : distance,
            timestamp: timestamp || new Date().toISOString()
        };

        db.addActivity(activity, (err, result) => {
            if (err) {
                console.error('Error adding activity:', err);
                return res.status(500).json({ error: 'Failed to add activity' });
            }
            
            res.status(201).json({ id: result.id, ...activity });
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.get('/api/activities', async (req, res) => {
    try {
        await ensureDB();
        
        const { from, to } = req.query;
        
        db.getActivities(from, to, (err, activities) => {
            if (err) {
                console.error('Error fetching activities:', err);
                return res.status(500).json({ error: 'Failed to fetch activities' });
            }
            res.json(activities);
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// For Vercel deployment (serverless)
if (isProduction) {
    module.exports = app;
} else {
    // Local development server
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Personal Activity Tracker server running on port ${PORT}`);
        console.log(`Activity Monitor: http://localhost:${PORT}`);
        console.log(`Activity Trend: http://localhost:${PORT}/trend`);
        console.log(`API Health: http://localhost:${PORT}/api/health`);
    });
}
