import express from 'express';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import cors from 'cors';
import 'express-async-errors';

// routes
import cityRoutes from './city/city.routes.js';
import forecastRoutes from './forecast/forecast.routes.js';

import errorHandler from './middleware/errorhandler.js';
import { config } from './config/meteo.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

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
