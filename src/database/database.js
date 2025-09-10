const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'activities.db');
let db;

function initialize(callback) {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err);
            return;
        }
        console.log('Connected to SQLite database');
        
        // Create activities table
        db.run(`
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                duration INTEGER NOT NULL,
                calories INTEGER NOT NULL,
                heartRate INTEGER NOT NULL,
                distance REAL,
                timestamp TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Activities table ready');
                // Insert sample data if table is empty
                insertSampleData();
            }
            if (callback) callback();
        });
    });
}

function insertSampleData() {
    db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
        if (err) {
            console.error('Error checking table:', err);
            return;
        }
        
        if (row.count === 0) {
            const sampleActivities = [
                { type: 'Running', duration: 45, calories: 225, heartRate: 88, distance: 5.1, timestamp: '2025-09-07T08:00:00Z' },
                { type: 'Swimming', duration: 50, calories: 353, heartRate: 95, distance: 1.3, timestamp: '2025-09-07T10:00:00Z' },
                { type: 'Pickleball', duration: 90, calories: 425, heartRate: 110, distance: null, timestamp: '2025-09-06T16:00:00Z' },
                { type: 'Hiking', duration: 65, calories: 620, heartRate: 94, distance: 10.2, timestamp: '2025-09-05T14:00:00Z' },
                { type: 'Walking', duration: 30, calories: 150, heartRate: 75, distance: 2.5, timestamp: '2025-09-04T18:00:00Z' }
            ];
            
            const stmt = db.prepare(`
                INSERT INTO activities (type, duration, calories, heartRate, distance, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            sampleActivities.forEach(activity => {
                stmt.run(activity.type, activity.duration, activity.calories, 
                        activity.heartRate, activity.distance, activity.timestamp);
            });
            
            stmt.finalize();
            console.log('Sample data inserted');
        }
    });
}

function addActivity(activity, callback) {
    const stmt = db.prepare(`
        INSERT INTO activities (type, duration, calories, heartRate, distance, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
        activity.type,
        activity.duration,
        activity.calories,
        activity.heartRate,
        activity.distance,
        activity.timestamp,
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { id: this.lastID });
            }
        }
    );
    
    stmt.finalize();
}

function getActivities(fromDate, toDate, callback) {
    let query = "SELECT * FROM activities";
    let params = [];
    
    if (fromDate && toDate) {
        query += " WHERE DATE(timestamp) BETWEEN ? AND ?";
        params = [fromDate, toDate];
    } else if (fromDate) {
        query += " WHERE DATE(timestamp) >= ?";
        params = [fromDate];
    } else if (toDate) {
        query += " WHERE DATE(timestamp) <= ?";
        params = [toDate];
    }
    
    query += " ORDER BY timestamp DESC";
    
    db.all(query, params, callback);
}

module.exports = {
    initialize,
    addActivity,
    getActivities
};
