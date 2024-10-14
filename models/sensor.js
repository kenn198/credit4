const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    activity: Number,
    timestamp: { type: Date, default: Date.now }
},{ collection: 'Sensor' });

const Sensor = mongoose.model('Sensor', sensorSchema);
module.exports = Sensor;
