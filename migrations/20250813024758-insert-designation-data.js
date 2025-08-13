"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed data for designation table
     */
    await queryInterface.bulkInsert(
      "designation",
      [
        {
          designation: "Software Engineer",
        },
        {
          designation: "Senior Software Engineer",
        },
        {
          designation: "Team Lead",
        },
        {
          designation: "Project Manager",
        },
        {
          designation: "QA Engineer",
        },
        {
          designation: "DevOps Engineer",
        },
        {
          designation: "Business Analyst",
        },
        {
          designation: "UI/UX Designer",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove the inserted designation data
     */
    await queryInterface.bulkDelete(
      "designation",
      {
        designation: [
          "Software Engineer",
          "Senior Software Engineer",
          "Team Lead",
          "Project Manager",
          "QA Engineer",
          "DevOps Engineer",
          "Business Analyst",
          "UI/UX Designer",
        ],
      },
      {}
    );
  },
};
