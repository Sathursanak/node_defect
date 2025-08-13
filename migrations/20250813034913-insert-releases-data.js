'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('releases', [
      {
        release_id: 'REL001',
        release_name: 'Version 1.0',
        releasedate: new Date('2024-06-01'),
        status: 1,
        releases_id: null,
        release_type_id: null
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('releases', null, {});
  }
};