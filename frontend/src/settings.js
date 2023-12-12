const settings = {
  endpoint:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'http://localhost:5005/api',
  lang: 'en',
  availableTranslations: ['es', 'en'],
  units: {
    temp: 'celsius',  // 'fahrenheit' or 'celsius'
    wind: 'km/h',     // 'km/h', 'mph', 'm/s', 'ft/s' and 'knots'
  },
  theme: 'light',     // 'light' or 'dark'
};

export default settings;
