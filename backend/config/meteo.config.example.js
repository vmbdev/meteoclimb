import databaseConfig from './database.json' assert { type: "json" };

export const config = {
  server: {
    // if changed, remember to update it in src/config.js
    port: 5005,
    enable_cors: true,
    cors_origin: 'http://localhost:5173'
  },

  database: process.env.NODE_ENV === 'production' ?
    databaseConfig.production :
    databaseConfig.development,

  weather: {
    provider: 'OpenWeather',
    apikey: '',
    units: 'metric' //standard, metric and imperial
  }
}
