'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('release_test_case', [
      {
        release_test_case_id: 'RTC001',
        description: 'Test case for login functionality',
        test_case_status: 'NEW',
        test_date: null,
        test_time: null,
        release_id: null,
        test_case_id: null,
        user_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('release_test_case', null, {});
  }
};