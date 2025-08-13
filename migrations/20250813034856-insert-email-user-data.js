'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('email_user', [
      {
        defect_email_status: 1,
        module_allocation_email_status: 1,
        project_allocation_email_status: 1,
        submodule_allocation_email_status: 1,
        user_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('email_user', null, {});
  }
};