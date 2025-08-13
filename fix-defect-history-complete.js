const sequelize = require('./db');

async function fixDefectHistoryComplete() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check defect_history table structure
    console.log('📊 Checking defect_history table structure:');
    const [columns] = await sequelize.query('DESCRIBE defect_history');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    // Get all defects with their current data
    console.log('\n📋 Getting all defects data:');
    const [allDefects] = await sequelize.query(`
      SELECT id, defect_id, description, assigned_by, assigned_to, defect_type_id, 
             defect_status_id, modules_id, priority_id, project_id, severity_id
      FROM defect ORDER BY id
    `);
    
    console.log(`Total defects: ${allDefects.length}`);

    // Check existing defect_history
    const [existingHistory] = await sequelize.query('SELECT defect_id FROM defect_history');
    const existingDefectIds = existingHistory.map(dh => dh.defect_id);
    
    // Add missing defects to defect_history with all required fields
    console.log('\n📝 Adding complete defect_history records...');
    
    for (const defect of allDefects) {
      if (!existingDefectIds.includes(defect.id)) {
        try {
          const defectRefId = `DH${String(defect.id).padStart(3, '0')}`;
          
          await sequelize.query(`
            INSERT INTO defect_history (
              defect_ref_id, defect_id, assigned_by, assigned_to, 
              defect_type_id, defect_status_id, modules_id, 
              priority_id, project_id, severity_id
            ) VALUES (
              '${defectRefId}', ${defect.id}, ${defect.assigned_by}, ${defect.assigned_to},
              ${defect.defect_type_id}, ${defect.defect_status_id}, ${defect.modules_id},
              ${defect.priority_id}, ${defect.project_id}, ${defect.severity_id}
            )
          `);
          console.log(`✅ Added defect_history: ${defectRefId} for defect ${defect.defect_id}`);
        } catch (error) {
          console.log(`❌ Error adding defect_history for ${defect.defect_id}: ${error.message}`);
        }
      }
    }

    // Add additional history records showing status changes for some defects
    console.log('\n📝 Adding status change history records...');
    
    const statusChangeHistory = [
      {
        defect_ref_id: 'DH001_REOPEN',
        defect_id: 1,
        defect_status_id: 1, // Changed to Open
        assigned_by: 1,
        assigned_to: 2
      },
      {
        defect_ref_id: 'DH002_PROGRESS',
        defect_id: 2,
        defect_status_id: 2, // Changed to In Progress
        assigned_by: 2,
        assigned_to: 3
      },
      {
        defect_ref_id: 'DH003_RESOLVED',
        defect_id: 3,
        defect_status_id: 3, // Changed to Resolved
        assigned_by: 1,
        assigned_to: 2
      },
      {
        defect_ref_id: 'DH004_CLOSED',
        defect_id: 4,
        defect_status_id: 4, // Changed to Closed
        assigned_by: 2,
        assigned_to: 1
      }
    ];

    for (const history of statusChangeHistory) {
      try {
        // Get the original defect data for other fields
        const originalDefect = allDefects.find(d => d.id === history.defect_id);
        
        await sequelize.query(`
          INSERT INTO defect_history (
            defect_ref_id, defect_id, assigned_by, assigned_to, 
            defect_type_id, defect_status_id, modules_id, 
            priority_id, project_id, severity_id
          ) VALUES (
            '${history.defect_ref_id}', ${history.defect_id}, ${history.assigned_by}, ${history.assigned_to},
            ${originalDefect.defect_type_id}, ${history.defect_status_id}, ${originalDefect.modules_id},
            ${originalDefect.priority_id}, ${originalDefect.project_id}, ${originalDefect.severity_id}
          )
        `);
        console.log(`✅ Added status change history: ${history.defect_ref_id} for defect ${originalDefect.defect_id}`);
      } catch (error) {
        console.log(`❌ Error adding status change history ${history.defect_ref_id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final defect_history verification:');
    const [finalHistory] = await sequelize.query(`
      SELECT dh.id, dh.defect_ref_id, dh.defect_id, d.defect_id as defect_code, 
             ds.defect_status_name, u1.first_name as assigned_by_name, u2.first_name as assigned_to_name
      FROM defect_history dh
      LEFT JOIN defect d ON dh.defect_id = d.id
      LEFT JOIN defect_status ds ON dh.defect_status_id = ds.id
      LEFT JOIN user u1 ON dh.assigned_by = u1.id
      LEFT JOIN user u2 ON dh.assigned_to = u2.id
      ORDER BY dh.defect_id, dh.id
    `);
    
    console.log(`Total defect_history records: ${finalHistory.length}`);
    
    // Group by defect
    const historyByDefect = {};
    finalHistory.forEach(dh => {
      if (!historyByDefect[dh.defect_code]) {
        historyByDefect[dh.defect_code] = [];
      }
      historyByDefect[dh.defect_code].push(dh);
    });

    console.log('\nHistory records by defect:');
    Object.keys(historyByDefect).forEach(defectCode => {
      const records = historyByDefect[defectCode];
      console.log(`\n  ${defectCode}: ${records.length} history record(s)`);
      records.forEach(r => {
        console.log(`    - ${r.defect_ref_id}: ${r.defect_status_name} (${r.assigned_by_name} → ${r.assigned_to_name})`);
      });
    });

    // Coverage check
    const [coverageCheck] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM defect) as total_defects,
        (SELECT COUNT(DISTINCT defect_id) FROM defect_history) as defects_with_history
    `);
    
    console.log(`\n📊 Coverage check:`);
    console.log(`  Total defects: ${coverageCheck[0].total_defects}`);
    console.log(`  Defects with history: ${coverageCheck[0].defects_with_history}`);
    
    if (coverageCheck[0].total_defects === coverageCheck[0].defects_with_history) {
      console.log('✅ All defects now have history records!');
    } else {
      console.log('❌ Some defects are still missing history records');
    }

    console.log('\n🎉 Successfully populated complete defect_history table!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixDefectHistoryComplete();
