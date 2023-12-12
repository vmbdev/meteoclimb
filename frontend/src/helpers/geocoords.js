/**
 * Converts the coordinate to DMS (Degrees, Minutes, Seconds)
 * @function
 * @param {*} coord
 * @param {*} type  Longitude ('lon') or latitude ('lat')
 * @returns  The coordinate in DMS
 */
const toDMS = (coord, type) => {
  const points = type === 'lon' ? ['E', 'W'] : ['N', 'S'];

  const absValue = Math.abs(coord);
  const degrees = Math.trunc(absValue);
  const minutes = Math.trunc(
    Number(absValue - Math.floor(absValue)).toFixed(6) * 60
  );

  return `${degrees}º ${minutes}" ${coord > 0 ? points[0] : points[1]}`;
};

export { toDMS };
