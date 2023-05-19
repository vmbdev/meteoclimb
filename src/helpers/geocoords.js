/**
 * @module helpers/geocoords
 */

/**
 * 
 * @param {*} coord 
 * @param {*} type 
 * @returns 
 */
const toDMS = (coord, type) => {
  const points = type === "lon" ? ['E', 'W'] : ['N', 'S'];

  const absValue = Math.abs(coord);
  const degrees = Math.trunc(absValue);
  const minutes = Math.trunc(Number(absValue - Math.floor(absValue)).toFixed(6) * 60);

  return `${degrees}º ${minutes}" ${coord > 0 ? points[0] : points[1] }`;
}

export { toDMS };