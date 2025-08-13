'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Insert privilege data
     */
    await queryInterface.bulkInsert('privilege', [
      {
        privilege_name: "Create Project"
      },
      {
        privilege_name: "Edit Project"
      },
      {
        privilege_name: "Delete Project"
      },
      {
        privilege_name: "View Project"
      },
      {
        privilege_name: "Assign Users"
      },
      {
        privilege_name: "Create Defect"
      },
      {
        privilege_name: "Edit Defect"
      },
      {
        privilege_name: "Delete Defect"
      },
      {
        privilege_name: "View Reports"
      },
      {
        privilege_name: "Manage Users"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Remove privilege data
     */
    await queryInterface.bulkDelete('privilege', {
      privilege_name: ["Create Project", "Edit Project", "Delete Project", "View Project", "Assign Users", "Create Defect", "Edit Defect", "Delete Defect", "View Reports", "Manage Users"]
    }, {});
  }
};