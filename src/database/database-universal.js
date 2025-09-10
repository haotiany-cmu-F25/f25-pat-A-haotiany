require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { MongoClient } = require('mongodb');
const path = require('path');

// Determine which database to use based on environment
const isProduction = process.env.NODE_ENV === 'production';
const useCloudDB = process.env.MONGODB_URI || isProduction;

let db;
let mongoClient;
let mongoDb;

async function initialize(callback) {
    if (useCloudDB && process.env.MONGODB_URI) {
        // Use MongoDB Atlas for production
        try {
            mongoClient = new MongoClient(process.env.MONGODB_URI);
            await mongoClient.connect();
            mongoDb = mongoClient.db('activity_tracker');
            console.log('Connected to MongoDB Atlas');
            
            // Ensure indexes
            await mongoDb.collection('activities').createIndex({ timestamp: -1 });
            
            // Insert sample data if collection is empty
            await insertSampleDataMongo();
            
            if (callback) callback();
        } catch (error) {
            console.error('MongoDB connection error:', error);
            // Fallback to SQLite
            initializeSQLite(callback);
        }
    } else {
        // Use SQLite for local development
        initializeSQLite(callback);
    }
}

function initializeSQLite(callback) {
    const dbPath = path.join(__dirname, 'activities.db');
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
                insertSampleDataSQLite();
            }
            if (callback) callback();
        });
    });
}

async function insertSampleDataMongo() {
    try {
        const count = await mongoDb.collection('activities').countDocuments();
        if (count === 0) {
            const sampleActivities = getSampleData();
            await mongoDb.collection('activities').insertMany(sampleActivities);
            console.log('Sample data inserted into MongoDB');
        }
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
}

function insertSampleDataSQLite() {
    db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
        if (err) {
            console.error('Error checking table:', err);
            return;
        }
        
        if (row.count === 0) {
            const sampleActivities = getSampleData();
            const stmt = db.prepare(`
                INSERT INTO activities (type, duration, calories, heartRate, distance, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            sampleActivities.forEach(activity => {
                stmt.run(activity.type, activity.duration, activity.calories, 
                        activity.heartRate, activity.distance, activity.timestamp);
            });
            
            stmt.finalize();
            console.log('Sample data inserted into SQLite');
        }
    });
}

function getSampleData() {
    return [
        { type: 'Running', duration: 45, calories: 225, heartRate: 88, distance: 5.1, timestamp: '2025-09-07T08:00:00Z' },
        { type: 'Swimming', duration: 50, calories: 353, heartRate: 95, distance: 1.3, timestamp: '2025-09-07T10:00:00Z' },
        { type: 'Pickleball', duration: 90, calories: 425, heartRate: 110, distance: null, timestamp: '2025-09-06T16:00:00Z' },
        { type: 'Hiking', duration: 65, calories: 620, heartRate: 94, distance: 10.2, timestamp: '2025-09-05T14:00:00Z' },
        { type: 'Walking', duration: 30, calories: 150, heartRate: 75, distance: 2.5, timestamp: '2025-09-04T18:00:00Z' },
        { type: 'Running', duration: 35, calories: 280, heartRate: 92, distance: 4.2, timestamp: '2025-09-03T07:30:00Z' },
        { type: 'Swimming', duration: 40, calories: 320, heartRate: 88, distance: 1.0, timestamp: '2025-09-02T09:00:00Z' },
        { type: 'Walking', duration: 25, calories: 125, heartRate: 70, distance: 2.0, timestamp: '2025-09-01T18:30:00Z' }
    ];
}

async function addActivity(activity, callback) {
    if (useCloudDB && mongoDb) {
        try {
            const result = await mongoDb.collection('activities').insertOne({
                ...activity,
                created_at: new Date()
            });
            callback(null, { id: result.insertedId });
        } catch (error) {
            callback(error);
        }
    } else {
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
}

async function getActivities(fromDate, toDate, callback) {
    if (useCloudDB && mongoDb) {
        try {
            let query = {};
            
            if (fromDate && toDate) {
                query.timestamp = {
                    $gte: fromDate + 'T00:00:00Z',
                    $lte: toDate + 'T23:59:59Z'
                };
            } else if (fromDate) {
                query.timestamp = { $gte: fromDate + 'T00:00:00Z' };
            } else if (toDate) {
                query.timestamp = { $lte: toDate + 'T23:59:59Z' };
            }
            
            const activities = await mongoDb.collection('activities')
                .find(query)
                .sort({ timestamp: -1 })
                .toArray();
            
            // Convert MongoDB _id to id for compatibility
            const formattedActivities = activities.map(activity => ({
                id: activity._id,
                type: activity.type,
                duration: activity.duration,
                calories: activity.calories,
                heartRate: activity.heartRate,
                distance: activity.distance,
                timestamp: activity.timestamp
            }));
            
            callback(null, formattedActivities);
        } catch (error) {
            callback(error);
        }
    } else {
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
}

async function closeConnection() {
    if (mongoClient) {
        await mongoClient.close();
    }
    if (db) {
        db.close();
    }
}

module.exports = {
    initialize,
    addActivity,
    getActivities,
    closeConnection
};
