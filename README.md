# Personal Activity Tracker

A web application for tracking personal fitness activities built with Node.js, Express.js, and vanilla JavaScript.

## Features
- Track activities (Walking, Running, Pickleball, Swimming, Hiking)
- Activity monitoring with date filtering
- 7-day activity trend visualization
- Real-time updates via Socket.io

## Technology Stack
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: SQLite (lightweight, local development)
- **Frontend**: HTML, CSS, JavaScript (no frameworks)
- **Charts**: Chart.js for activity trends

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Project Structure
```
├── src/
│   ├── server/          # Backend server code
│   ├── public/          # Frontend static files
│   └── database/        # Database configuration
├── docs/                # Project documentation
└── .github/            # GitHub and Copilot configurations
```

## API Endpoints
- `POST /api/activities` - Add new activity
- `GET /api/activities` - Get activities with optional date filtering
- `GET /` - Activity Monitor page
- `GET /trend` - Activity Trend page
