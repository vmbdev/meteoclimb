// import City from '../city.js';
// import { db } from '../database.js';
// import { data } from './city.list.min.json' assert { type: 'json' };

// console.log(data.length);

// for (var prop of data) {
//   prop.lon = prop.coord.lon;
//   prop.lat = prop.coord.lat;
//   delete prop.coord;
// }

// City.init(db);
// City.sync().then(() => {
//   City.bulkCreate(data).catch((error) => {
//     console.log('Error during Post: ' + error);
//   });
// });
