/**
 * @module ErrorHandler
 */
import MeteoError from '../meteoerror.js';

/**
 * Manages the unhandled errors catched in Express.
 * @function
 * @param {Object} error
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const errorHandler = (error, req, res, next) => {
  if (error.name && error.name === 'SequelizeDatabaseError') {
    res.status(500).send({ error: 'Database error' });
  } else if (error instanceof MeteoError) {
    res.status(error.code).send({ error: error.msg });
  }
};

export default errorHandler;
