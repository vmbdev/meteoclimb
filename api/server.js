import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// routes
import cityRoutes from './city.routes.js';

// models
import City from './city.model.js';
import Forecast from './forecast.model.js';
import ForecastLog from './forecastlog.model.js';

import config from '../meteo.config.js';
import db from './database.js';
import OpenWeather from './providers/openweather.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const weatherProvider = new OpenWeather(config.weather.apikey, config.weather.units)
City.init(db);
Forecast.init(db);
ForecastLog.init(db);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

app.use('/api/city', cityRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});