/**
 * @module ApiService
 */
import { DateTime } from 'luxon';
import ky from 'ky';
import settings from '../settings.js';

/**
 * Service unifying the access to the backend.
 * @class
 */
export class ApiService {
  constructor(endpoint) {
    this.endpoint = ky.create({ prefixUrl: endpoint });
  }

  /**
   * Fetches the forecast for a determined city and dates.
   * @param {number} cityId  The id of the city in the database.
   * @param {string} dates  A list of dates represented as the difference of
   *     the current day (today = 0, tomorrow = 1, day after tomorrow = 2, ...)
   * @returns {Promise<Forecast[]>}  A promise with the forecast.
   */
  async getForecast(cityId, dates) {
    const procDates = dates
      .map(
        (date) =>
          DateTime.fromFormat(date, 'yyyy-MM-dd').toUTC().diffNow('days').days
      )
      .map((date) => Math.abs(Math.ceil(date)))
      .filter((i) => {
        // filter out past dates (i.e. user searched for the then current day,
        // but it was 5 days ago)
        return i > -1 && i <= 6;
      })
      .join(';');

    return this.endpoint.get(`forecast/${cityId}/${procDates}`).json();
  }

  /**
   * Fetches the list of cities that matches fully or partially the name.
   * @param {string} name  The name or part of it of the city.
   * @returns {Promise<City[]>}  A promise with the list of matching cities.
   */
  async getCities(name) {
    return this.endpoint.get(`city/search/${name}`).json();
  }
}

export const api = new ApiService(settings.endpoint);
