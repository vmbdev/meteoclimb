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
    this.path = `/data/2.5/onecall?appid=${this.key}&units=${this.units}`;
  }

  /**
   * Generates the full URL to make a request.
   * @param {*} lon  Longitude
   * @param {*} lat  Latitude
   * @param {*} exclude
   * @returns {string}  The full path.
   */
  getPath(lon, lat, exclude = null) {
    if (lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90) {
      const query = `&lon=${lon}&lat=${lat}${
        exclude ? `&exclude=${exclude}` : ''
      }`;

      return this.host + this.path + query;
    }

    return null;
  }

  /**
   * Makes a request to OpenWeather to retrieve the forecast for a certain
   * coordenate set.
   * @async
   * @param {*} lon  Longitude
   * @param {*} lat  Latitude
   * @param {*} exclude
   * @returns {Object}  An object containing the forecast for seven days.
   */
  async getWeatherData(lon, lat, exclude = null) {
    const res = await ky.get(this.getPath(lon, lat, exclude)).json();

    return res;
  }
}

export default OpenWeather;
