"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "test_case",
      [
        {
          test_case_id: "TC001",
          description: "User login functionality test",
          steps: "Enter username and password, click login",
          defect_type_id: 1,
          modules_id: 1,
          project_id: 3,
          severity_id: 1,
          sub_module_id: 6,
        },
        {
          test_case_id: "TC002",
          description: "User registration validation",
          steps: "Test all form validations for user registration",
          defect_type_id: 1,
          modules_id: 1,
          project_id: 3,
          severity_id: 2,
          sub_module_id: 6,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("test_case", null, {});
  },
};
