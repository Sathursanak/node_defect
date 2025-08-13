'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('smtp_config', [
      {
        name: 'Default SMTP',
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        username: 'noreply@company.com',
        password: 'encrypted_password',
        from_email: 'noreply@company.com',
        from_name: 'Company System'
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('smtp_config', null, {});
  }
};