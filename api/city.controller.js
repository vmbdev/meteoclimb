import City from './city.model.js';

const getCity = (req, res) => {
  res.sendStatus(405);
}

const getCityNameList = (req, res) => {
  City.findByName(req.params.name).then(cities => {
    res.json(cities);
  });
}

const CityController = { getCity, getCityNameList };
export default CityController;