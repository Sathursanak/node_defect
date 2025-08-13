"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "allocate_module",
      [
        {
          user_id: null,
          modules_id: 1,
          sub_module_id: 6,
          project_id: null,
        },
        {
          user_id: null,
          modules_id: 2,
          sub_module_id: 7,
          project_id: null,
        },
        {
          user_id: null,
          modules_id: 3,
          sub_module_id: 9,
          project_id: null,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("allocate_module", null, {});
  },
};
