# Personal Activity Tracker API

## Test the API

### Add a new activity (POST)
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Running",
    "duration": 30,
    "calories": 300,
    "heartRate": 150,
    "distance": 3.5,
    "timestamp": "2025-09-10T08:00:00Z"
  }'
```

### Get all activities
```bash
curl http://localhost:3000/api/activities
```

### Get activities with date filter
```bash
curl "http://localhost:3000/api/activities?from=2025-09-01&to=2025-09-10"
```

## Activity Types
- **Walking**: requires distance
- **Running**: requires distance  
- **Swimming**: requires distance
- **Hiking**: requires distance
- **Pickleball**: no distance required (set to null)

## Sample Activity JSON
```json
{
  "type": "Swimming",
  "duration": 45,
  "calories": 400,
  "heartRate": 120,
  "distance": 1.5,
  "timestamp": "2025-09-10T10:00:00Z"
}
```
