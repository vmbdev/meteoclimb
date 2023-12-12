export const convertTemperature = (temp, unit) => {
  if (unit === 'fahrenheit') return Math.round((temp * 9/5) + 32);

  return temp;
}

export const convertWind = (temp, unit) => {
  if (unit === 'km/h') return temp;

  let res;

  switch (unit) {
    case 'mph': {
      res = temp / 1.609;
      break;
    }
    case 'knots': {
      res = temp / 1.852;
      break;
    }
    case 'm/s': {
      res = temp / 3.6;
      break;
    }
    case 'ft/s': {
      res = temp / 1.097;
      break;
    }
  }

  return res.toFixed(2);
}