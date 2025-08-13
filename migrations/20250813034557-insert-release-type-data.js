'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Insert release_type data
     */
    await queryInterface.bulkInsert('release_type', [
      {
        release_type_name: "Major Release"
      },
      {
        release_type_name: "Minor Release"
      },
      {
        release_type_name: "Patch Release"
      },
      {
        release_type_name: "Hotfix"
      },
      {
        release_type_name: "Beta Release"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Remove release_type data
     */
    await queryInterface.bulkDelete('release_type', {
      release_type_name: ["Major Release", "Minor Release", "Patch Release", "Hotfix", "Beta Release"]
    }, {});
  }
};