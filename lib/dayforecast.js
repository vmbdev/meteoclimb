export default class DayForecast {
  constructor() {
    this.start_time = NaN;
    this.sunrise = NaN;
    this.sunset = NaN;
    this.humidity = 0;
    this.temp = {
      max_temp: NaN,
      feels_like: NaN
    };
    this.wind = {
      speed: 0,
      degrees: NaN
    }
    this.pop = {
      chance: 0,
      from: NaN,
      rain_amount: 0,
      snow_amount: 0
    };
  }
}
