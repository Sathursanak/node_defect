"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert modules data
     */
    await queryInterface.bulkInsert(
      "modules",
      [
        {
          module_id: "MOD001",
          module_name: "User Management",
          project_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          module_id: "MOD002",
          module_name: "Authentication",
          project_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          module_id: "MOD003",
          module_name: "Project Management",
          project_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          module_id: "MOD004",
          module_name: "Defect Tracking",
          project_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          module_id: "MOD005",
          module_name: "Reporting",
          project_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove modules data
     */
    await queryInterface.bulkDelete(
      "modules",
      {
        module_id: ["MOD001", "MOD002", "MOD003", "MOD004", "MOD005"],
      },
      {}
    );
  },
};
