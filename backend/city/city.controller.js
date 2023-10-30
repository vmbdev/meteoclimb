/**
 * @module city/controller
 */

import City from './city.model.js';

/**
 * Given a partial City name, lists objects matching results
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getCityNameList = async (req, res) => {
  const cities = await City.findByName(req.params.name);
  res.json(cities);
}

const CityController = { getCityNameList };
export default CityController;