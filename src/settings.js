const settings = {
  endpoint: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5005/api',
  lang: 'en-GB',
  availableTranslations: [
    'es',
    'en-GB'
  ],
  theme: 'light',
}

export default settings;