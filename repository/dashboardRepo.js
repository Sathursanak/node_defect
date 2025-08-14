const sequelize = require("../db");
const Defect = require("../models/defect");
const Project = require("../models/project");

async function getDefectDensity() {
  try {
    return await sequelize.query(
      `
      SELECT
         p.id,
         p.project_name,
         p.kloc,
         COUNT(d.id) as total_defects,
         COUNT(d.id) / p.kloc as defect_density
      FROM
         project p
      LEFT JOIN
         defect d ON p.id = d.project_id
      GROUP BY
         p.id, p.project_name, p.kloc
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
  } catch (error) {
    // If deadlock, retry once
    if (
      error.message.includes("Deadlock") ||
      error.message.includes("deadlock")
    ) {
      console.log("Deadlock detected, retrying query...");
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
      return await sequelize.query(
        `
        SELECT
           p.id,
           p.project_name,
           p.kloc,
           COUNT(d.id) as total_defects,
           COUNT(d.id) / p.kloc as defect_density
        FROM
           project p
        LEFT JOIN
           defect d ON p.id = d.project_id
        GROUP BY
           p.id, p.project_name, p.kloc
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );
    }
    throw error;
  }
}

module.exports = {
  getDefectDensity,
};
