'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project_allocation_history', [
      {
        percentage: 100,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        status: 1,
        project_id: null,
        user_id: null,
        role_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project_allocation_history', null, {});
  }
};