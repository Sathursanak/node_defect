'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    // Skip defect insertion for now due to NOT NULL user constraints
    // This will be populated after users are created
    console.log('Skipping defect data insertion - requires user data first');
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('defect', null, {});
  }
};