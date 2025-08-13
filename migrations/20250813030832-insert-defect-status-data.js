"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert defect status data
     */
    await queryInterface.bulkInsert(
      "defect_status",
      [
        {
          defect_status_name: "Open",
          color_code: "#dc3545", // Red
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_status_name: "In Progress",
          color_code: "#ffc107", // Yellow
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_status_name: "Fixed",
          color_code: "#17a2b8", // Blue
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_status_name: "Verified",
          color_code: "#28a745", // Green
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_status_name: "Closed",
          color_code: "#6c757d", // Gray
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_status_name: "Reopened",
          color_code: "#fd7e14", // Orange
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          defect_status_name: "Rejected",
          color_code: "#343a40", // Dark
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove defect status data
     */
    await queryInterface.bulkDelete(
      "defect_status",
      {
        defect_status_name: [
          "Open",
          "In Progress",
          "Fixed",
          "Verified",
          "Closed",
          "Reopened",
          "Rejected",
        ],
      },
      {}
    );
  },
};
