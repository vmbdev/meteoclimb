import City from './city.model.js';

/**
 * Given an Id number, return the city object
 * @async
 * @function
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getCityById = async (req, res, next) => {
  const id = +req.params.id;

  if (id) {
    const city = await City.findByPk(id);
    res.json(city);
  }
}

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
};

const CityController = { getCityById, getCityNameList };
export default CityController;
