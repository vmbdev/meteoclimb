/**
 * @module ForecastRoutes
 */
import express from 'express';
import ForecastController from './forecast.controller.js';

const router = express.Router();

router.get('/:cityId/:dateOffset?', ForecastController.getForecast);
router.get('*', (req, res) => {
  res.sendStatus(404);
});

export default router;
