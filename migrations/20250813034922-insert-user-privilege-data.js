'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_privilege', [
      { user_Id: null, project_id: null, privilege_id: null }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_privilege', null, {});
  }
};