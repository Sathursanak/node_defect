const sequelize = require("./db");

async function debugDefectsByModule() {
  try {
    console.log('🔍 Debugging Defects by Module...');
    
    const projectId = 1; // Test with project ID 1
    
    // Test 1: Check if we can connect to the database
    console.log('\n1️⃣ Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test 2: Check what modules exist
    console.log('\n2️⃣ Checking modules table...');
    const modulesQuery = 'SELECT * FROM modules LIMIT 5';
    const modules = await sequelize.query(modulesQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log('Modules found:', modules.length);
    console.log('Sample modules:', modules);
    
    // Test 3: Check what defects exist for project 1
    console.log('\n3️⃣ Checking defects for project 1...');
    const defectsQuery = `
      SELECT 
        COUNT(*) as total_defects,
        COUNT(DISTINCT modules_id) as unique_modules
      FROM defect 
      WHERE project_id = ${projectId}
    `;
    const defects = await sequelize.query(defectsQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log('Defects info:', defects);
    
    // Test 4: Check defect statuses
    console.log('\n4️⃣ Checking defect statuses...');
    const statusQuery = `
      SELECT 
        ds.defect_status_name,
        COUNT(*) as count
      FROM defect d
      INNER JOIN defect_status ds ON d.defect_status_id = ds.id
      WHERE d.project_id = ${projectId}
      GROUP BY ds.defect_status_name
    `;
    const statuses = await sequelize.query(statusQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log('Defect statuses:', statuses);
    
    // Test 5: Check modules with defects
    console.log('\n5️⃣ Checking modules with defects...');
    const moduleDefectsQuery = `
      SELECT 
        m.id as module_id,
        m.module_id as module_code,
        m.module_name,
        COUNT(d.id) as total_defects,
        GROUP_CONCAT(DISTINCT ds.defect_status_name) as statuses
      FROM defect d
      INNER JOIN modules m ON d.modules_id = m.id
      INNER JOIN defect_status ds ON d.defect_status_id = ds.id
      WHERE d.project_id = ${projectId}
      GROUP BY m.id, m.module_id, m.module_name
      ORDER BY total_defects DESC
    `;
    const moduleDefects = await sequelize.query(moduleDefectsQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log('Modules with defects:', moduleDefects);
    
    // Test 6: Test the valid defect calculation
    console.log('\n6️⃣ Testing valid defect calculation...');
    const validDefectsQuery = `
      SELECT 
        m.id as module_id,
        m.module_id as module_code,
        m.module_name,
        COUNT(d.id) as total_defects,
        SUM(CASE WHEN LOWER(ds.defect_status_name) NOT IN ('duplicate','rejected') THEN 1 ELSE 0 END) as valid_defects
      FROM defect d
      INNER JOIN modules m ON d.modules_id = m.id
      INNER JOIN defect_status ds ON d.defect_status_id = ds.id
      WHERE d.project_id = ${projectId}
      GROUP BY m.id, m.module_id, m.module_name
      ORDER BY valid_defects DESC
    `;
    const validDefects = await sequelize.query(validDefectsQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log('Valid defects calculation:', validDefects);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

// Run the debug
debugDefectsByModule();
