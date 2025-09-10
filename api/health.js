module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Personal Activity Tracker API is running'
    });
};
