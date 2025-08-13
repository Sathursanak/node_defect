'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comments', [
      { comment: 'Sample comment 1', attachment: null, defect_id: null, user_id: null },
      { comment: 'Sample comment 2', attachment: null, defect_id: null, user_id: null }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};