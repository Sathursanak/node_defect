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

// compute defect to remark ratio (using valid_defects vs total_defects)
async function getDefectRemarkRatio() {
  const counts = await getDefectCounts();
  return counts.map((row) => ({
    ...row,
    defect_to_remark_ratio:
      row.total_defects && row.total_defects !== 0
        ? row.valid_defects / row.total_defects
        : null,
  }));
}

async function getSeverityIndex() {
  const [maxWeightRow] = await sequelize.query(
    `SELECT MAX(CAST(weight AS DECIMAL(10,2))) as max_weight FROM severity`,
    {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    }
  );

  const maxWeight = maxWeightRow?.max_weight ? Number(maxWeightRow.max_weight) : null;

  const rows = await sequelize.query(
    `
    SELECT
      p.id,
      p.project_name,
      SUM(CASE WHEN LOWER(ds.defect_status_name) NOT IN ('duplicate','rejected') THEN CAST(s.weight AS DECIMAL(10,2)) ELSE 0 END) AS weighted_sum,
      SUM(CASE WHEN LOWER(ds.defect_status_name) NOT IN ('duplicate','rejected') THEN 1 ELSE 0 END) AS valid_defects
    FROM project p
    LEFT JOIN defect d ON p.id = d.project_id
    LEFT JOIN defect_status ds ON d.defect_status_id = ds.id
    LEFT JOIN severity s ON d.severity_id = s.id
    GROUP BY p.id, p.project_name
    `,
    {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    }
  );

  return rows.map((row) => {
    const valid = Number(row.valid_defects || 0);
    const weightedSum = Number(row.weighted_sum || 0);
    let severity_index_percent = null;
    if (valid > 0 && maxWeight && maxWeight > 0) {
      const avgWeight = weightedSum / valid;
      severity_index_percent = (avgWeight / maxWeight) * 100;
    }
    return {
      id: row.id,
      project_name: row.project_name,
      valid_defects: valid,
      severity_index_percent: severity_index_percent,
    };
  });
}


module.exports = {
  getDefectDensity,
  getDefectCounts,
  getDefectRemarkRatio,
  getSeverityIndex,
};
