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
    if ((lon >= -180 && lon <= 180) && (lat >= -90 && lat <= 90)) {
      const query = `&lon=${lon}&lat=${lat}${exclude ? `&exclude=${exclude}` : ''}`;

      return this.host + this.path + query;
    }

    return null;
  }

  async getWeatherData(lon, lat, exclude = null) {
    const res = await got(this.getPath(lon, lat, exclude), { responseType: 'json' });
    return res.body;
  }
}
