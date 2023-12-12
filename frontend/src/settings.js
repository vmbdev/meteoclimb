const settings = {
  endpoint: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5005/api',
  lang: 'en',
  availableTranslations: [
    'es',
    'en'
  ],
  units: {
    temp: 'celsius',
    wind: 'km/h',
  },
  theme: 'light',
}

export default settings;