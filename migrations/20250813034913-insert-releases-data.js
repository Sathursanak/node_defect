"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "releases",
      [
        {
          release_id: "REL001",
          release_name: "Version 1.0",
          releasedate: new Date("2024-06-01"),
          status: 1,
          release_type_id: 1,
          project_id: 1,
        },
        {
          release_id: "REL002",
          release_name: "Version 1.1",
          releasedate: new Date("2024-07-01"),
          status: 1,
          release_type_id: 2,
          project_id: 2,
        },
        {
          release_id: "REL003",
          release_name: "Version 1.2",
          releasedate: new Date("2024-08-01"),
          status: 0,
          release_type_id: 3,
          project_id: 1,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("releases", null, {});
  },
};
