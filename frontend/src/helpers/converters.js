/**
 * Given a temperature in Celsius, convert it to another unit.
 * @function
 * @param {number} temp  The temperature.
 * @param {'celsius'|'fahrenheit'} unit  The unit to convert to.
 * @returns {number}  The value of the temperature converted in the new unit.
 */
export const convertTemperature = (temp, unit) => {
  if (unit === 'fahrenheit') return Math.round((temp * 9) / 5 + 32);

  return temp;
};

/**
 * Given a wind speed value in km/h, convert it to another unit.
 * @function
 * @param {*} wind  The wind speed.
 * @param {'km/h' | 'mph' | 'knots' | 'm/s' | 'ft/s'} unit  The unit to convert to.
 * @returns {number}  The value of the wind speed converted in the new unit.
 */
export const convertWind = (wind, unit) => {
  if (unit === 'km/h') return wind;

  let res;

  switch (unit) {
    case 'mph': {
      res = wind / 1.609;
      break;
    }
    case 'knots': {
      res = wind / 1.852;
      break;
    }
    case 'm/s': {
      res = wind / 3.6;
      break;
    }
    case 'ft/s': {
      res = wind / 1.097;
      break;
    }
  }

  return res.toFixed(2);
};
