"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert bench data
     */
    await queryInterface.bulkInsert(
      "bench",
      [
        {
          bench_id: "BENCH001",
          allocated: 0,
          availability: 1,
          user_id: null,
        },
        {
          bench_id: "BENCH002",
          allocated: 1,
          availability: 0,
          user_id: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove bench data
     */
    await queryInterface.bulkDelete("bench", null, {});
  },
};
