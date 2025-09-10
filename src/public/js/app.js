// Activity Monitor JavaScript
// Note: Socket.io disabled for serverless deployment compatibility

// DOM elements
const currentDateElement = document.getElementById('current-date');
const activitiesListElement = document.getElementById('activities-list');
const fromDateInput = document.getElementById('from-date');
const toDateInput = document.getElementById('to-date');
const filterBtn = document.getElementById('filter-btn');
const clearBtn = document.getElementById('clear-btn');

// State
let activities = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    loadActivities();
    setupEventListeners();
    
    // Auto-refresh every 30 seconds for new activities
    setInterval(loadActivities, 30000);
});

function updateCurrentDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    currentDateElement.textContent = `My Activities - ${today.toLocaleDateString('en-US', options)}`;
}

function setupEventListeners() {
    filterBtn.addEventListener('click', applyDateFilter);
    clearBtn.addEventListener('click', clearDateFilter);
    
    // Allow Enter key to trigger filter
    fromDateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyDateFilter();
    });
    
    toDateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyDateFilter();
    });
}

function loadActivities(fromDate = null, toDate = null) {
    showLoading();
    
    let url = '/api/activities';
    const params = new URLSearchParams();
    
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            activities = data;
            renderActivities();
        })
        .catch(error => {
            console.error('Error loading activities:', error);
            showError('Failed to load activities');
        });
}

function applyDateFilter() {
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;
    
    if (fromDate && toDate && fromDate > toDate) {
        alert('From date cannot be later than To date');
        return;
    }
    
    loadActivities(fromDate, toDate);
}

function clearDateFilter() {
    fromDateInput.value = '';
    toDateInput.value = '';
    loadActivities();
}

function renderActivities() {
    if (activities.length === 0) {
        showEmptyState();
        return;
    }
    
    // Group activities by date
    const groupedActivities = groupActivitiesByDate(activities);
    
    let html = '';
    
    Object.keys(groupedActivities).forEach(date => {
        html += `<div class="activity-item">`;
        html += `<div class="activity-date">${formatDate(date)}</div>`;
        
        groupedActivities[date].forEach(activity => {
            html += renderActivityEntry(activity);
        });
        
        html += `</div>`;
    });
    
    activitiesListElement.innerHTML = html;
}

function groupActivitiesByDate(activities) {
    const grouped = {};
    
    activities.forEach(activity => {
        const date = new Date(activity.timestamp).toDateString();
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(activity);
    });
    
    return grouped;
}

function renderActivityEntry(activity) {
    const iconClass = activity.type.toLowerCase().replace(' ', '');
    const distanceInfo = activity.distance ? `${activity.distance} mi | ` : '';
    
    return `
        <div class="activity-entry">
            <div class="activity-icon ${iconClass}"></div>
            <div class="activity-details">
                <div class="activity-info">
                    <span class="activity-stat">${activity.duration} min</span>
                    <span class="activity-stat">${distanceInfo}${activity.calories} calories</span>
                </div>
                <div class="activity-heart-rate">
                    ❤️ ${activity.heartRate} bpm
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }
}

function showLoading() {
    activitiesListElement.innerHTML = `
        <div class="loading">
            <p>Loading activities...</p>
        </div>
    `;
}

function showEmptyState() {
    activitiesListElement.innerHTML = `
        <div class="empty-state">
            <p>No activities found for the selected period.</p>
            <p>Activities can be added via the REST API.</p>
        </div>
    `;
}

function showError(message) {
    activitiesListElement.innerHTML = `
        <div class="empty-state">
            <p>Error: ${message}</p>
            <button onclick="loadActivities()" class="btn btn-primary">Try Again</button>
        </div>
    `;
}
