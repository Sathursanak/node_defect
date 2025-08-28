const sequelize = require("../db");

// get defect counts per project
async function getDefectCounts() {
  try {
    return await sequelize.query(
  `
  SELECT
     p.id,
     p.project_name,
     p.kloc,
     COUNT(d.id) as total_defects,
     SUM(CASE WHEN LOWER(ds.defect_status_name) = 'duplicate' THEN 1 ELSE 0 END) as total_duplicate,
     SUM(CASE WHEN LOWER(ds.defect_status_name) = 'rejected' THEN 1 ELSE 0 END) as total_rejected,
     (COUNT(d.id) 
       - SUM(CASE WHEN LOWER(ds.defect_status_name) = 'duplicate' THEN 1 ELSE 0 END) 
       - SUM(CASE WHEN LOWER(ds.defect_status_name) = 'rejected' THEN 1 ELSE 0 END)
     ) as valid_defects
  FROM
     project p
  LEFT JOIN
     defect d ON p.id = d.project_id
  LEFT JOIN
     defect_status ds ON d.defect_status_id = ds.id
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
     SUM(CASE WHEN LOWER(ds.defect_status_name) = 'duplicate' THEN 1 ELSE 0 END) as total_duplicate,
     SUM(CASE WHEN LOWER(ds.defect_status_name) = 'rejected' THEN 1 ELSE 0 END) as total_rejected,
     (COUNT(d.id) 
       - SUM(CASE WHEN LOWER(ds.defect_status_name) = 'duplicate' THEN 1 ELSE 0 END) 
       - SUM(CASE WHEN LOWER(ds.defect_status_name) = 'rejected' THEN 1 ELSE 0 END)
     ) as valid_defects
  FROM
     project p
  LEFT JOIN
     defect d ON p.id = d.project_id
  LEFT JOIN
     defect_status ds ON d.defect_status_id = ds.id
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

// Use getDefectCounts in getDefectDensity
async function getDefectDensity() {
  const counts = await getDefectCounts();
  // Add defect_density to each project
  return counts.map((row) => ({
    ...row,
    defect_density:
      row.kloc && row.kloc !== 0 ? row.valid_defects / row.kloc : null,
  }));
}

// get severity breakdown counts per project
async function getDefectSeverityCounts() {
  try {
    return await sequelize.query(
      `
      SELECT
         p.id,
         p.project_name,
         p.kloc,
         SUM(CASE WHEN ds.defect_severity_name = 'blocker' THEN 1 ELSE 0 END) as total_blocker,
         SUM(CASE WHEN ds.defect_severity_name = 'critical' THEN 1 ELSE 0 END) as total_critical,
         SUM(CASE WHEN ds.defect_severity_name = 'major' THEN 1 ELSE 0 END) as total_major,
         SUM(CASE WHEN ds.defect_severity_name = 'minor' THEN 1 ELSE 0 END) as total_minor
      FROM
         project p
      LEFT JOIN
         defect d ON p.id = d.project_id
      LEFT JOIN
         defect_severity ds ON d.defect_severity_id = ds.id
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
           SUM(CASE WHEN ds.defect_severity_name = 'blocker' THEN 1 ELSE 0 END) as total_blocker,
           SUM(CASE WHEN ds.defect_severity_name = 'critical' THEN 1 ELSE 0 END) as total_critical,
           SUM(CASE WHEN ds.defect_severity_name = 'major' THEN 1 ELSE 0 END) as total_major,
           SUM(CASE WHEN ds.defect_severity_name = 'minor' THEN 1 ELSE 0 END) as total_minor
        FROM
           project p
        LEFT JOIN
           defect d ON p.id = d.project_id
        LEFT JOIN
           defect_severity ds ON d.defect_severity_id = ds.id
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
  getDefectCounts,
};
