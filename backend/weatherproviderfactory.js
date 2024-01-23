import OpenWeather from './providers/openweather.js';

/**
 * Factory class to generate provider objects.
 * @class
 */
class WeatherProviderFactory {
  static create(provider, key, units) {
    let newProvider;

    switch (provider) {
      case 'OpenWeather':
        newProvider = new OpenWeather(key, units);
        break;
      default:
        throw new Error(`No valid provider: ${provider}`);
    }

    return newProvider;
  }
}

export default WeatherProviderFactory;
