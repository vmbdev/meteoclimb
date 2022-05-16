export default class WeatherProvider {
  constructor (key, units) {
    if (this.constructor === WeatherProvider)
      throw new TypeError('Cannot instantiate WeatherProvider class');

    this.key = key;
    this.units = units;
  }
}
