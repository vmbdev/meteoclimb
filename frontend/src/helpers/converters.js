export const convertTemperature = (temp, unit) => {
  if (unit === 'fahrenheit') return Math.round((temp * 9/5) + 32);

  return temp;
}

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
}