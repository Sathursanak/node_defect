'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('group_privilege', [
      { privilege_id: null, role_id: null }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('group_privilege', null, {});
  }
};