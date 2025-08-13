'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('project_user_privilege', [
      {
        privilege_id: null,
        project_id: null,
        user_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('project_user_privilege', null, {});
  }
};