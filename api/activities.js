const db = require('../src/database/database-universal');

let dbInitialized = false;
async function ensureDB() {
    if (!dbInitialized) {
        await new Promise((resolve) => {
            db.initialize(resolve);
        });
        dbInitialized = true;
    }
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        await ensureDB();
        
        if (req.method === 'POST') {
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
        } else if (req.method === 'GET') {
            const { from, to } = req.query;
            
            db.getActivities(from, to, (err, activities) => {
                if (err) {
                    console.error('Error fetching activities:', err);
                    return res.status(500).json({ error: 'Failed to fetch activities' });
                }
                res.json(activities);
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}
