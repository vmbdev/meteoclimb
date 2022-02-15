import { Sequelize, DataTypes } from 'sequelize';
import config from './config.js';

const db = new Sequelize(config.database.name, config.database.user, config.database.password, {
  query: { raw: true },
  host: config.database.host,
  dialect: config.database.dialect
});

export default db;
