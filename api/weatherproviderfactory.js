import { config } from '../meteo.config.js';
import OpenWeather from './providers/openweather.js';

// factory class to generate provider objects
class WeatherProviderFactory {
  static create(
    provider = config.weather.provider,
    key = config.weather.apikey,
    units = config.weather.units
  ) {
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