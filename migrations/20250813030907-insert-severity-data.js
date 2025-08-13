"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Insert severity data
     */
    await queryInterface.bulkInsert(
      "severity",
      [
        {
          severity_name: "Critical",
          severity_color: "#dc3545", // Red
          weight: "1",
        },
        {
          severity_name: "High",
          severity_color: "#fd7e14", // Orange
          weight: "2",
        },
        {
          severity_name: "Medium",
          severity_color: "#ffc107", // Yellow
          weight: "3",
        },
        {
          severity_name: "Low",
          severity_color: "#28a745", // Green
          weight: "4",
        },
        {
          severity_name: "Minor",
          severity_color: "#17a2b8", // Blue
          weight: "5",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove severity data
     */
    await queryInterface.bulkDelete(
      "severity",
      {
        severity_name: ["Critical", "High", "Medium", "Low", "Minor"],
      },
      {}
    );
  },
};
