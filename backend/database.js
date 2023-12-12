import { Sequelize } from 'sequelize';
import { config } from './config/meteo.config.js';

const db = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    //query: { raw: true },
    host: config.database.host,
    dialect: config.database.dialect,
    timezone: 'utc',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
  }
);

export default db;
