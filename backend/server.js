import express from 'express';
import cors from 'cors';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';
import 'express-async-errors';

// routes
import cityRoutes from './city/city.routes.js';
import forecastRoutes from './forecast/forecast.routes.js';

// models
import City from './city/city.model.js';
import Forecast from './forecast/forecast.model.js';
import ForecastLog from './forecast/forecastlog.model.js';

import errorHandler from './middleware/errorhandler.js';

import db from './database.js';
import { config } from './config/meteo.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  await db.authenticate();
  console.log('Database connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database.');
  process.exit(1);
}

// Start the models with the Sequelize database object
City.init(db);
Forecast.init(db);
ForecastLog.init(db);

const app = express();

if (config.server.enable_cors === true && config.server.cors_origin) {
  app.use(cors({ origin: config.server.cors_origin }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// check if the frontend is built under /frontend/build, and if so, route
// everything statically from /
try {
  const frontendPath = path.join(__dirname, '../', 'frontend', 'build');
  await stat(frontendPath);
  app.use('/', express.static(frontendPath));

  console.log('[Frontend] Enabled routing.');
} catch (err) {
  console.log('[Frontend] Routing not enabled because a build was not found.');
}

app.use('/api/city', cityRoutes);
app.use('/api/forecast', forecastRoutes);
app.use(errorHandler);

const port = process.env.PORT || config.server.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
