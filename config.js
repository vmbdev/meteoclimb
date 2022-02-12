export default {
  database: {
    name: 'caniclimb',
    user: 'postgres',
    password: 'curricurri',
    host: 'localhost',
    dialect: 'postgres'
  },
  weather: {
    provider: 'openweather',
    apikey: '3dfd59609d4698bc6cc54a405de9efd3',
    units: 'standard' //standard, metric and imperial
  }
};
