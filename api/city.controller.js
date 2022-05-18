/**
 * Express controller providing City related routes
 * @module controllers/city
 * @requires model/city
 */

import City from './city.model.js';

/**
 * (NOT IMPLEMENTED) Given a City Id, retrieves the City object
 */
const getCity = (req, res) => {
  res.sendStatus(405);
}

/**
 * Given a partial City name, lists objects matching results
 */
const getCityNameList = (req, res) => {
  City.findByName(req.params.name).then(cities => {
    res.json(cities);
  });
}

const CityController = { getCity, getCityNameList };
export default CityController;