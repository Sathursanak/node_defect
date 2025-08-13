"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "project",
      [
        {
          project_id: "PROJ001",
          project_name: "E-Commerce Platform",
          client_name: "TechCorp Inc",
          description: "Online shopping platform development",
          email: "contact@techcorp.com",
          phone_no: "1234567890",
          country: "USA",
          state: "California",
          start_date: new Date("2024-01-01"),
          end_date: new Date("2024-12-31"),
          kloc: 50.5,
          project_status: "ACTIVE",
          user_Id: null,
        },
        {
          project_id: "PROJ002",
          project_name: "Mobile App Development",
          client_name: "TechStart LLC",
          description: "iOS and Android mobile application",
          email: "contact@techstart.com",
          phone_no: "3333333333",
          country: "USA",
          state: "NY",
          start_date: new Date("2024-03-01"),
          end_date: new Date("2024-11-30"),
          kloc: 25.5,
          project_status: "ACTIVE",
          user_Id: null,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("project", null, {});
  },
};
