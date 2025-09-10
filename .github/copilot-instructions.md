# Personal Activity Tracker - Copilot Instructions

## Project Overview
Create a functional Personal Activity Tracker web application that tracks exercise activities for a single user.

## Architecture
- **Backend**: Node.js, Express.js, Socket.io server with REST API
- **Database**: SQLite/MongoDB/MySQL (lightweight, local development)
- **Frontend**: HTML, CSS, JavaScript, Socket.io (NO React or frameworks)
- **Visualization**: JavaScript chart library for activity trends

## Data Model
Each activity has:
- Type: Walking, Running, Pickleball, Swimming, Hiking
- Timestamp
- Duration (minutes)
- Energy expenditure (calories)
- Average heart rate (bpm)
- Distance in miles (all types except Pickleball)

## Pages Required
1. **Activity Monitor**: List of activities with filtering by date range
2. **Activity Trend**: Line chart showing 7-day calorie trends

## Technical Requirements
- REST API for adding activities (no UI for adding)
- Socket.io for real-time updates
- Responsive design matching wireframes
- Local database setup
- No user authentication required

## Implementation Notes
- Focus on working prototype over perfection
- Use modern JavaScript features
- Ensure cross-browser compatibility
- Handle errors gracefully
- Use semantic HTML and accessible design
