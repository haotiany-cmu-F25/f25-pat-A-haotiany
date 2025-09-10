const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const db = require('../database/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/trend', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/trend.html'));
});

// API Routes
app.post('/api/activities', (req, res) => {
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
            return res.status(500).json({ error: 'Failed to add activity' });
        }
        
        // Emit real-time update
        io.emit('activityAdded', { ...activity, id: result.id });
        
        res.status(201).json({ id: result.id, ...activity });
    });
});

app.get('/api/activities', (req, res) => {
    const { from, to } = req.query;
    
    db.getActivities(from, to, (err, activities) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch activities' });
        }
        res.json(activities);
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Initialize database and start server
db.initialize(() => {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Personal Activity Tracker server running on port ${PORT}`);
        console.log(`Activity Monitor: http://localhost:${PORT}`);
        console.log(`Activity Trend: http://localhost:${PORT}/trend`);
        console.log(`Public Access: The server is accessible from external networks`);
    });
});
