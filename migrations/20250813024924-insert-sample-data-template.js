"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Template for inserting data into multiple tables
     * This is a comprehensive example showing different patterns
     */

    // Example 1: Insert data into priority table
    await queryInterface.bulkInsert(
      "priority",
      [
        {
          priority: "Low",
          color: "#28a745", // Green
        },
        {
          priority: "Medium",
          color: "#ffc107", // Yellow
        },
        {
          priority: "High",
          color: "#fd7e14", // Orange
        },
        {
          priority: "Critical",
          color: "#dc3545", // Red
        },
      ],
      {}
    );

    // Example 2: Insert data with timestamps (if your table has them)
    // await queryInterface.bulkInsert('table_with_timestamps', [
    //   {
    //     name: 'Sample Name',
    //     description: 'Sample Description',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   }
    // ], {});

    // Example 3: Insert data conditionally (check if data doesn't exist)
    // const existingRecords = await queryInterface.sequelize.query(
    //   "SELECT id FROM priority WHERE priority = 'Low'",
    //   { type: queryInterface.sequelize.QueryTypes.SELECT }
    // );
    //
    // if (existingRecords.length === 0) {
    //   await queryInterface.bulkInsert('priority', [
    //     { priority: 'Low', color: '#28a745' }
    //   ], {});
    // }

    // Example 4: Insert with foreign key relationships
    // First insert parent records, then child records
    // await queryInterface.bulkInsert('parent_table', [...], {});
    // await queryInterface.bulkInsert('child_table', [
    //   { parent_id: 1, name: 'Child 1' }
    // ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Remove the inserted data in reverse order
     */

    // Remove priority data
    await queryInterface.bulkDelete(
      "priority",
      {
        priority: ["Low", "Medium", "High", "Critical"],
      },
      {}
    );

    // If you inserted data with foreign keys, remove child records first
    // await queryInterface.bulkDelete('child_table', null, {});
    // await queryInterface.bulkDelete('parent_table', null, {});
  },
};
