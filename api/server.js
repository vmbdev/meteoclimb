/**
 * @module express
 * @requires controllers/city
 * @requires controllers/forecast
 */

import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// routes
import cityRoutes from './city.routes.js';
import forecastRoutes from './forecast.routes.js';

// models
import City from './city.model.js';
import Forecast from './forecast.model.js';
import ForecastLog from './forecastlog.model.js';

import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

City.init(db);
Forecast.init(db);
ForecastLog.init(db);

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

app.use('/api/city', cityRoutes);
app.use('/api/forecast', forecastRoutes);
app.get("*", (res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});