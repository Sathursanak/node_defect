"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert sub_module data
     */
    await queryInterface.bulkInsert(
      "sub_module",
      [
        {
          sub_module_id: "SUB001",
          sub_module_name: "User Registration",
          modules_id: 1,
        },
        {
          sub_module_id: "SUB002",
          sub_module_name: "User Login",
          modules_id: 2,
        },
        {
          sub_module_id: "SUB003",
          sub_module_name: "Password Reset",
          modules_id: 2,
        },
        {
          sub_module_id: "SUB004",
          sub_module_name: "Project Creation",
          modules_id: 3,
        },
        {
          sub_module_id: "SUB005",
          sub_module_name: "Defect Reporting",
          modules_id: 4,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove sub_module data
     */
    await queryInterface.bulkDelete(
      "sub_module",
      {
        sub_module_id: ["SUB001", "SUB002", "SUB003", "SUB004", "SUB005"],
      },
      {}
    );
  },
};
