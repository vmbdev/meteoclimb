export const config = {
  server: {
    // if changed, remember to update it in src/config.js
    port: 5005,
    enable_cors: true,
    cors_origin: 'http://localhost:5173'
  },

  database: {
    name: 'database',
    user: 'user',
    password: 'password',
    host: 'localhost',
    dialect: 'postgres' // comply with Sequelize dialects
  },

  weather: {
    provider: 'OpenWeather',
    apikey: '',
    units: 'metric' //standard, metric and imperial
  }
}