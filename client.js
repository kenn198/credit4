const request = require('request');

// Create new sensor data
request.post('http://localhost:3000/sensorData', {
    json: { temperature: 25, humidity: 50, activity: 3 }
}, (err, res, body) => {
    if (err) return console.error(err);
    console.log('New sensor data added:', body);
});

// Get all sensor data
request('http://localhost:3000/sensorData', (err, res, body) => {
    if (err) return console.error(err);
    console.log('All sensor data:', body);
});
