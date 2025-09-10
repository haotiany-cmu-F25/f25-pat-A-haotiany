// Activity Trend Chart JavaScript
// Note: Socket.io disabled for serverless deployment compatibility

let chart;

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    loadTrendData();
    
    // Auto-refresh every 60 seconds for new data
    setInterval(loadTrendData, 60000);
});

function initializeChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Calories',
                data: [],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#007bff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Calories'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#007bff',
                    borderWidth: 1
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function loadTrendData() {
    // Get data for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // 7 days total including today
    
    const fromDate = startDate.toISOString().split('T')[0];
    const toDate = endDate.toISOString().split('T')[0];
    
    fetch(`/api/activities?from=${fromDate}&to=${toDate}`)
        .then(response => response.json())
        .then(activities => {
            const trendData = processTrendData(activities, startDate, endDate);
            updateChart(trendData);
            updateTrendTitle(startDate, endDate);
        })
        .catch(error => {
            console.error('Error loading trend data:', error);
        });
}

function processTrendData(activities, startDate, endDate) {
    const days = [];
    const caloriesByDay = {};
    
    // Initialize all days with 0 calories
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push(dayName);
        caloriesByDay[dateStr] = 0;
    }
    
    // Sum calories for each day
    activities.forEach(activity => {
        const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
        if (caloriesByDay.hasOwnProperty(activityDate)) {
            caloriesByDay[activityDate] += activity.calories;
        }
    });
    
    const calories = Object.values(caloriesByDay);
    
    return { days, calories };
}

function updateChart(trendData) {
    chart.data.labels = trendData.days;
    chart.data.datasets[0].data = trendData.calories;
    chart.update('none'); // No animation for real-time updates
}

function updateTrendTitle(startDate, endDate) {
    const titleElement = document.getElementById('trend-title');
    const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    
    const startFormatted = startDate.toLocaleDateString('en-US', formatOptions);
    const endFormatted = endDate.toLocaleDateString('en-US', formatOptions);
    
    titleElement.textContent = `Weekly Trend for ${startFormatted} - ${endFormatted}`;
}
