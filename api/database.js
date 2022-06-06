import { Sequelize } from 'sequelize';
import { database } from './../meteo.config.js';

const db = new Sequelize(database.name, database.user, database.password, {
  //query: { raw: true },
  host: database.host,
  dialect: database.dialect,
  timezone: 'utc',
  logging: process.env.NODE_ENV === 'production' ? false : console.log
});

export default db;
