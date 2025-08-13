"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert defect type data
     */
    await queryInterface.bulkInsert(
      "defect_type",
      [
        {
          defect_type_name: "Functional",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Performance",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "UI/UX",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Security",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Compatibility",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Usability",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Data",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Integration",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Configuration",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_type_name: "Documentation",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove defect type data
     */
    await queryInterface.bulkDelete(
      "defect_type",
      {
        defect_type_name: [
          "Functional",
          "Performance",
          "UI/UX",
          "Security",
          "Compatibility",
          "Usability",
          "Data",
          "Integration",
          "Configuration",
          "Documentation",
        ],
      },
      {}
    );
  },
};
