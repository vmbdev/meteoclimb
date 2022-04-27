const config = {
  database: {
    name: 'database',
    user: 'user',
    password: 'password',
    host: 'localhost',
    dialect: 'postgres' // comply with Sequelize dialects
  },
  weather: {
    provider: 'openweather',
    apikey: '',
    units: 'metric' //standard, metric and imperial
  }
};

export default config;