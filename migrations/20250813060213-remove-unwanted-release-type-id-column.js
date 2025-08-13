"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Remove the unwanted release_type_id column from release_type table
     * This column was not defined in the model and contains only NULL values
     */

    // First, check if there are any foreign key constraints and remove them
    try {
      // Drop any foreign key constraints on this column
      await queryInterface.sequelize.query(`
        ALTER TABLE release_type
        DROP FOREIGN KEY IF EXISTS release_type_ibfk_1
      `);
    } catch (error) {
      console.log("No foreign key constraint to remove or already removed");
    }

    // Remove the unwanted column
    await queryInterface.removeColumn("release_type", "release_type_id");

    console.log(
      "✅ Removed unwanted release_type_id column from release_type table"
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add the column back if needed (though it shouldn't be needed)
     */
    await queryInterface.addColumn("release_type", "release_type_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    console.log("⚠️ Re-added release_type_id column (rollback)");
  },
};
