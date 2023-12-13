/**
 * @module CityRoutes
 */

import express from 'express';
import CityController from './city.controller.js';

const router = express.Router();

router.get('/:id', CityController.getCityById);
router.get('/search/:name', CityController.getCityNameList);
router.get('*', (req, res) => {
  res.sendStatus(404);
});

export default router;
