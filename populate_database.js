const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const { db, City } = require('./database');
const data = require('./city.list.min.json');

console.log(data.length);

for (var prop of data) {
  prop.lon = prop.coord.lon;
  prop.lat = prop.coord.lat;
  delete prop.coord;
}

console.log(City);
City.sync().then(() => {
  City.bulkCreate(data).catch((error) => {
    console.log('Error during Post: ' + error);
  });
});
