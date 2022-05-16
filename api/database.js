import { Sequelize } from 'sequelize';
import config from './../meteo.config.js';

const db = new Sequelize(config.database.name, config.database.user, config.database.password, {
  //query: { raw: true },
  host: config.database.host,
  dialect: config.database.dialect,
  timezone: 'utc',
  logging: process.env.NODE_ENV === 'production' ? false : console.log
});

export default db;
