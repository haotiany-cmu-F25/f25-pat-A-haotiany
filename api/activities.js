// Serverless function for activities API
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        if (req.method === 'POST') {
            const { type, duration, calories, heartRate, distance, timestamp } = req.body;
            
            const activity = {
                id: Date.now(), // Simple ID for demo
                type,
                duration: parseInt(duration),
                calories: parseInt(calories),
                heartRate: parseInt(heartRate),
                distance: type === 'Pickleball' ? null : parseFloat(distance),
                timestamp: timestamp || new Date().toISOString()
            };

            // For demo purposes, return the activity (in production, save to database)
            res.status(201).json(activity);
            
        } else if (req.method === 'GET') {
            // Return sample data for demo
            const sampleActivities = [
                { id: 1, type: 'Running', duration: 45, calories: 225, heartRate: 88, distance: 5.1, timestamp: '2025-09-07T08:00:00Z' },
                { id: 2, type: 'Swimming', duration: 50, calories: 353, heartRate: 95, distance: 1.3, timestamp: '2025-09-07T10:00:00Z' },
                { id: 3, type: 'Pickleball', duration: 90, calories: 425, heartRate: 110, distance: null, timestamp: '2025-09-06T16:00:00Z' },
                { id: 4, type: 'Hiking', duration: 65, calories: 620, heartRate: 94, distance: 10.2, timestamp: '2025-09-05T14:00:00Z' },
                { id: 5, type: 'Walking', duration: 30, calories: 150, heartRate: 75, distance: 2.5, timestamp: '2025-09-04T18:00:00Z' },
                { id: 6, type: 'Running', duration: 35, calories: 280, heartRate: 92, distance: 4.2, timestamp: '2025-09-03T07:30:00Z' },
                { id: 7, type: 'Swimming', duration: 40, calories: 320, heartRate: 88, distance: 1.0, timestamp: '2025-09-02T09:00:00Z' },
                { id: 8, type: 'Walking', duration: 25, calories: 125, heartRate: 70, distance: 2.0, timestamp: '2025-09-01T18:30:00Z' }
            ];
            
            const { from, to } = req.query;
            let filteredActivities = sampleActivities;
            
            // Apply date filtering if provided
            if (from || to) {
                filteredActivities = sampleActivities.filter(activity => {
                    const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
                    if (from && to) {
                        return activityDate >= from && activityDate <= to;
                    } else if (from) {
                        return activityDate >= from;
                    } else if (to) {
                        return activityDate <= to;
                    }
                    return true;
                });
            }
            
            res.json(filteredActivities);
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
