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
  let points = type === "lon" ? ['E', 'W'] : ['N', 'S'];

  let absValue = Math.abs(coord);
  let degrees = Math.trunc(absValue);
  let minutes = Math.trunc(Number(absValue - Math.floor(absValue)).toFixed(6) * 60);

  return `${degrees}º ${minutes}" ${coord > 0 ? points[0] : points[1] }`;
}

export { toDMS };