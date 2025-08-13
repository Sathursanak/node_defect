'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        user_id: 'USR001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.com',
        password: 'hashedpassword123',
        phone_no: '1234567890',
        user_gender: 'Male',
        user_status: 'Active',
        join_date: new Date('2024-01-15'),
        designation_id: 1
      },
      {
        user_id: 'USR002',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company.com',
        password: 'hashedpassword456',
        phone_no: '0987654321',
        user_gender: 'Female',
        user_status: 'Active',
        join_date: new Date('2024-02-01'),
        designation_id: 2
      },
      {
        user_id: 'USR003',
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@company.com',
        password: 'hashedpassword789',
        phone_no: '5555555555',
        user_gender: 'Male',
        user_status: 'Active',
        join_date: new Date('2024-01-20'),
        designation_id: 3
      }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};