import { app } from './app.js';

// models
import City from './city/city.model.js';
import Forecast from './forecast/forecast.model.js';
import ForecastLog from './forecast/forecastlog.model.js';

import db from './database.js';
import { config } from './config/meteo.config.js';

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

const port = process.env.PORT || config.server.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
