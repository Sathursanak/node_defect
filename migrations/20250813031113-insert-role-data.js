"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert role data
     */
    await queryInterface.bulkInsert(
      "role",
      [
        {
          role_name: "Admin",
        },
        {
          role_name: "Project Manager",
        },
        {
          role_name: "Team Lead",
        },
        {
          role_name: "Developer",
        },
        {
          role_name: "QA Engineer",
        },
        {
          role_name: "Business Analyst",
        },
        {
          role_name: "Tester",
        },
        {
          role_name: "Viewer",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove role data
     */
    await queryInterface.bulkDelete(
      "role",
      {
        role_name: [
          "Admin",
          "Project Manager",
          "Team Lead",
          "Developer",
          "QA Engineer",
          "Business Analyst",
          "Tester",
          "Viewer",
        ],
      },
      {}
    );
  },
};
