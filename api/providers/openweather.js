import got from 'got';
import WeatherProvider from './../weatherprovider.js';

export default class OpenWeather extends WeatherProvider {
  constructor(key, units = 'standard') {
    super(key, units);

    // lat={lat}&lon={lon}&exclude={part}
    this.host = 'https://api.openweathermap.org';
    this.path = `/data/2.5/onecall?appid=${this.key}&units=${this.units}`
  }

  getPath(lon, lat, exclude = null) {
    if ((lon >= -180 && lon <= 80) && (lat >= -90 && lat <= 90))
      return this.host + this.path + `&lon=${lon}&lat=${lat}${exclude ? `&exclude=${exclude}` : ''}`;

    return null;
  }

  async getWeatherData(lon, lat, exclude = null) {
    return got(this.getPath(lon, lat, exclude), {responseType: 'json'}).then(res => { return res.body });
  }
}
