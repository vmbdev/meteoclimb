'use strict';

const cities = require('../../city.list.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let query = [];

    for (const city of cities) {
      query.push({
        id: city.id,
        name: city.name,
        flatName: city.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase(),
        state: city.state,
        country: city.country,
        lon: city.coord.lon,
        lat: city.coord.lat,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      });

      if (query.length === 200) {
        await queryInterface.bulkInsert('Cities', query);
        query = [];
      }
    }

    // remanining cities not being inserted in the loop
    if (query.length > 0) {
      await queryInterface.bulkInsert('Cities', query);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Cities', null, {});
  },
};
