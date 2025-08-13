'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('defect_history', [
      {
        assigned_by: 'Admin',
        assigned_to: 'Developer',
        defect_date: new Date(),
        defect_ref_id: 'DEF001',
        defect_status: 'Open',
        defect_time: '10:00:00',
        previous_status: 'New',
        record_status: 'Active',
        release_id: 1,
        defect_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('defect_history', null, {});
  }
};