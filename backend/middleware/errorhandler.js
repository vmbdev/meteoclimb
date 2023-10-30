import MeteoError from '../meteoerror.js';

const errorHandler = (error, req, res, next) => {
  if (error.name && error.name === 'SequelizeDatabaseError') {
    res.status(500).send({ error: 'Database error' });

  }
  else if (error instanceof MeteoError) {
    res.status(error.code).send({ error: error.msg });
  }
}

export default errorHandler;