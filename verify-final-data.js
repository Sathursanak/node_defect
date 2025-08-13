const sequelize = require('./db');

async function verifyFinalData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🎉 FINAL COMPREHENSIVE VERIFICATION\n');
    console.log('='.repeat(60));

    // 1. Check projects
    console.log('\n🏗️ PROJECTS (Target: 5):');
    const [projects] = await sequelize.query('SELECT project_id, project_name, client_name FROM project ORDER BY id');
    projects.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.project_id}: ${p.project_name} (${p.client_name})`);
    });
    console.log(`✅ Total projects: ${projects.length}/5`);

    // 2. Check defects
    console.log('\n🐛 DEFECTS (Target: 10):');
    const [defects] = await sequelize.query('SELECT defect_id, description FROM defect ORDER BY id');
    defects.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.defect_id}: ${d.description.substring(0, 50)}...`);
    });
    console.log(`✅ Total defects: ${defects.length}/10`);

    // 3. Check defect history
    console.log('\n📊 DEFECT HISTORY:');
    const [historyCount] = await sequelize.query('SELECT COUNT(*) as count FROM defect_history');
    console.log(`Total defect_history records: ${historyCount[0].count}`);

    const [coverageCheck] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM defect) as total_defects,
        (SELECT COUNT(DISTINCT defect_id) FROM defect_history) as defects_with_history
    `);
    
    console.log(`Defects with history: ${coverageCheck[0].defects_with_history}/${coverageCheck[0].total_defects}`);

    if (coverageCheck[0].defects_with_history === coverageCheck[0].total_defects) {
      console.log('✅ All defects have history records');
    } else {
      console.log('❌ Some defects missing history records');
    }

    // 4. Check for NULL values in critical tables
    console.log('\n🔍 NULL VALUE CHECK:');
    
    // Check defects
    const [defectNulls] = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN defect_id IS NULL THEN 1 ELSE 0 END) as null_defect_id,
        SUM(CASE WHEN description IS NULL THEN 1 ELSE 0 END) as null_description,
        SUM(CASE WHEN assigned_by IS NULL THEN 1 ELSE 0 END) as null_assigned_by,
        SUM(CASE WHEN assigned_to IS NULL THEN 1 ELSE 0 END) as null_assigned_to,
        SUM(CASE WHEN project_id IS NULL THEN 1 ELSE 0 END) as null_project_id
      FROM defect
    `);
    
    console.log('Defect table NULLs:');
    console.log(`  defect_id: ${defectNulls[0].null_defect_id}, description: ${defectNulls[0].null_description}`);
    console.log(`  assigned_by: ${defectNulls[0].null_assigned_by}, assigned_to: ${defectNulls[0].null_assigned_to}`);
    console.log(`  project_id: ${defectNulls[0].null_project_id}`);

    // Check defect_history
    const [historyNulls] = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN defect_ref_id IS NULL THEN 1 ELSE 0 END) as null_ref_id,
        SUM(CASE WHEN defect_id IS NULL THEN 1 ELSE 0 END) as null_defect_id,
        SUM(CASE WHEN defect_date IS NULL THEN 1 ELSE 0 END) as null_date,
        SUM(CASE WHEN defect_status IS NULL THEN 1 ELSE 0 END) as null_status
      FROM defect_history
    `);
    
    console.log('Defect_history table NULLs:');
    console.log(`  defect_ref_id: ${historyNulls[0].null_ref_id}, defect_id: ${historyNulls[0].null_defect_id}`);
    console.log(`  defect_date: ${historyNulls[0].null_date}, defect_status: ${historyNulls[0].null_status}`);

    // Check projects
    const [projectNulls] = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN project_id IS NULL THEN 1 ELSE 0 END) as null_project_id,
        SUM(CASE WHEN project_name IS NULL THEN 1 ELSE 0 END) as null_name,
        SUM(CASE WHEN client_name IS NULL THEN 1 ELSE 0 END) as null_client,
        SUM(CASE WHEN user_Id IS NULL THEN 1 ELSE 0 END) as null_user_id
      FROM project
    `);
    
    console.log('Project table NULLs:');
    console.log(`  project_id: ${projectNulls[0].null_project_id}, project_name: ${projectNulls[0].null_name}`);
    console.log(`  client_name: ${projectNulls[0].null_client}, user_Id: ${projectNulls[0].null_user_id}`);

    // 5. Sample defect history
    if (historyCount[0].count > 0) {
      console.log('\n📋 SAMPLE DEFECT HISTORY:');
      const [sampleHistory] = await sequelize.query(`
        SELECT dh.defect_ref_id, d.defect_id, dh.defect_status, dh.previous_status, dh.defect_date
        FROM defect_history dh
        LEFT JOIN defect d ON dh.defect_id = d.id
        ORDER BY d.defect_id, dh.defect_date
        LIMIT 10
      `);
      
      let currentDefect = '';
      sampleHistory.forEach(h => {
        if (h.defect_id !== currentDefect) {
          console.log(`\n  ${h.defect_id}:`);
          currentDefect = h.defect_id;
        }
        console.log(`    ${h.defect_ref_id}: ${h.previous_status} → ${h.defect_status} (${h.defect_date})`);
      });
    }

    // 6. Overall summary
    console.log('\n📈 OVERALL SUMMARY:');
    console.log('='.repeat(40));
    
    const allTablesCount = [
      { name: 'Projects', count: projects.length, target: 5 },
      { name: 'Defects', count: defects.length, target: 10 },
      { name: 'Defect History', count: historyCount[0].count, target: 'All defects covered' }
    ];
    
    allTablesCount.forEach(table => {
      const status = typeof table.target === 'number' ? 
        (table.count >= table.target ? '✅' : '❌') : 
        (coverageCheck[0].defects_with_history === coverageCheck[0].total_defects ? '✅' : '❌');
      console.log(`  ${status} ${table.name}: ${table.count} ${typeof table.target === 'number' ? `/ ${table.target}` : ''}`);
    });

    // Calculate total NULL values
    const totalNulls = Object.values(defectNulls[0]).reduce((sum, val) => sum + parseInt(val), 0) +
                      Object.values(historyNulls[0]).reduce((sum, val) => sum + parseInt(val), 0) +
                      Object.values(projectNulls[0]).reduce((sum, val) => sum + parseInt(val), 0);

    console.log(`\n🔍 Total NULL values in critical fields: ${totalNulls}`);

    if (projects.length >= 5 && defects.length >= 10 && 
        coverageCheck[0].defects_with_history === coverageCheck[0].total_defects && 
        totalNulls === 0) {
      console.log('\n🎉 PERFECT! ALL REQUIREMENTS MET!');
      console.log('✅ 5+ Projects');
      console.log('✅ 10+ Defects');
      console.log('✅ Complete defect history for all defects');
      console.log('✅ No NULL values in critical fields');
    } else {
      console.log('\n⚠️ Some requirements not fully met');
    }

    console.log('\n='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

verifyFinalData();
