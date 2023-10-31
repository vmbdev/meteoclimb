/**
 * @module forecast/controller
 */

import forecastService from './forecast.service.js';

/**
 * Gets the forecast for the requested city and dates.
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getForecast = async (req, res, next) => {
  let dateList;
  
  // separate the parameters, convert the strings to numbers ("2" -> 2),
  // remove the falsy elements and check 0 >= j <=6
  if (req.params.dateOffset) {
    dateList =
      req.params.dateOffset
        .split(';')
        .map(i => parseInt(i))
        .filter(j => j >= 0 && j <= 6);
  }
  else dateList = [0];

  try {
    const forecast =
      await forecastService.fetchForecast(req.params.cityId, dateList);

    res.json(forecast);
  } catch (err) {
    return next(err)
  }
}

const ForecastController = { getForecast }
export default ForecastController;