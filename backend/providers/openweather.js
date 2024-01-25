import ky from 'ky';
import WeatherProvider from './../weatherprovider.js';

/**
 * Class providing support for OpenWeather as a weather provider.
 * @class
 */
class OpenWeather extends WeatherProvider {
  /**
   * Constructs an OpenWeather object.
   * @param {*} key  API key
   * @param {*} units  Can be standard, metric and imperial
   */
  constructor(key, units = 'standard') {
    super(key, units);

    // lat={lat}&lon={lon}&exclude={part}
    this.host = 'https://api.openweathermap.org';
    this.oneCallPath = `/data/2.5/onecall?appid=${this.key}&units=${this.units}`;
    this.airPollutionPath = `/data/2.5/air_pollution/forecast?appid=${this.key}`;
  }

  /**
   * Generates the full URL to make a request.
   * @param {*} lon  Longitude
   * @param {*} lat  Latitude
   * @param {*} exclude
   * @returns {string}  The full path.
   */
  getPath(lon, lat, options = { exclude: null, call: 'forecast' }) {
    if (lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90) {
      let path;
      const query = `&lon=${lon}&lat=${lat}${
        options.exclude ? `&exclude=${exclude}` : ''
      }`;

      switch (options.call) {
        case 'airpollution': {
          path = this.airPollutionPath;
          break;
        }
        case 'forecast':
        default: {
          path = this.oneCallPath;
          break;
        }
      }

      return this.host + path + query;
    }

    return null;
  }

  /**
   * Makes a request to OpenWeather to retrieve the forecast for a certain
   * coordenate set.
   * @param {*} lon  Longitude
   * @param {*} lat  Latitude
   * @param {*} exclude
   * @returns {Promise<Object>}  A promise containing the forecast for seven days.
   */
  getWeatherData(lon, lat, exclude = null) {
    const res = ky
      .get(this.getPath(lon, lat, { exclude, call: 'forecast' }))
      .json();

    return res;
  }

  /**
   * Makes a request to OpenWeather to retrieve the air pollution for a certain
   * coordenate set.
   * @param {*} lon  Longitude
   * @param {*} lat  Latitude
   * @returns {Promise<Object>}  A promise containing the forecast for seven days.
   */
  getAirPollutionData(lon, lat) {
    const res = ky.get(this.getPath(lon, lat, { call: 'airpollution' })).json();

    return res;
  }
}

export default OpenWeather;
