const express = require('express');
const mongoose = require('mongoose');
const Sensor = require('./models/sensor'); // Import your Sensor model
const weather = require('weather-js');
const app = express();
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Credit4', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// CREATE a sensor reading
app.post('/sensorData', async (req, res) => {
    const sensorReading = new Sensor(req.body); // Assume the body contains sensor data
    await sensorReading.save();
    res.send(sensorReading); // Return the created sensor data
});

// READ all sensor readings
app.get('/sensorData', async (req, res) => {
    const readings = await Sensor.find(); // Retrieve all sensor data from the DB
    res.send(readings);
});

// Endpoint to get the latest temperature reading
app.get('/temperature/latest', async (req, res) => {
    try {
        const latestSensorData = await Sensor.findOne().sort({ timestamp: -1 }).limit(1);
        if (latestSensorData) {
            res.json({ temperature: latestSensorData.temperature });
        } else {
            res.status(404).send({ message: 'No sensor data found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving sensor data' });
    }
});

// DELETE a specific sensor reading
app.delete('/sensorData/:id', async (req, res) => {
    const reading = await Sensor.findByIdAndDelete(req.params.id); // Find and delete by ID
    res.send(reading); // Send back the deleted document
});

// Create a route to handle GET requests for specific city weather
app.get('/weather/:cityName', (req, res) => {
    const city = req.params.cityName;  // Get the city name from the URL

    weather.find({ search: city, degreeType: 'C' }, (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Error fetching weather data' });
        } else {
            res.json(result);  // Send weather data back as JSON
        }
    });
});

// Update a sensor reading by ID
app.put('/sensorData/:id', async (req, res) => {
    try {
        const updatedReading = await Sensor.findByIdAndUpdate(
            req.params.id,
            req.body, // Data to update (you send in the request body)
            { new: true } // Return the updated document
        );
        res.send(updatedReading); // Send back the updated reading
    } catch (err) {
        res.status(500).send({ error: 'Unable to update the sensor reading' });
    }
});
app.listen(3000, () => console.log('Server is listening on port 3000'));
