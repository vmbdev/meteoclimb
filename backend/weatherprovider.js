/**
 * @module WeatherProvider
 */

/**
 * Generic class providing a common base for weather provider classes.
 * @class
 */
class WeatherProvider {
  /**
   * Constructs the object after checking that it's part of a superclass.
   * @param {*} key  API key
   * @param {*} units  Can be standard, metric and imperial
   */
  constructor(key, units) {
    if (this.constructor === WeatherProvider) {
      throw new TypeError('Cannot instantiate WeatherProvider class');
    }

    this.key = key;
    this.units = units;
  }
}

export default WeatherProvider;
