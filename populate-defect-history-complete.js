const sequelize = require('./db');

async function populateDefectHistoryComplete() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Get all defects with their current assignments
    const [allDefects] = await sequelize.query(`
      SELECT d.id, d.defect_id, d.assigned_by, d.assigned_to,
             u1.first_name as assigned_by_name, u2.first_name as assigned_to_name
      FROM defect d
      LEFT JOIN user u1 ON d.assigned_by = u1.id
      LEFT JOIN user u2 ON d.assigned_to = u2.id
      ORDER BY d.id
    `);

    // Get existing defect_history
    const [existingHistory] = await sequelize.query('SELECT defect_id FROM defect_history');
    const existingDefectIds = existingHistory.map(dh => dh.defect_id);

    console.log(`📊 Total defects: ${allDefects.length}, Existing history: ${existingHistory.length}`);

    // Add defect_history records for missing defects
    console.log('\n📝 Adding complete defect_history records...');

    for (const defect of allDefects) {
      if (!existingDefectIds.includes(defect.id)) {
        try {
          const defectRefId = `DH${String(defect.id).padStart(3, '0')}`;
          
          await sequelize.query(`
            INSERT INTO defect_history (
              defect_ref_id, defect_id, assigned_by, assigned_to,
              defect_date, defect_time, defect_status, previous_status,
              record_status, release_id
            ) VALUES (
              '${defectRefId}', ${defect.id}, '${defect.assigned_by_name}', '${defect.assigned_to_name}',
              '2024-01-15', '10:00:00', 'Open', 'New', 'Active', 1
            )
          `);
          console.log(`✅ Added defect_history: ${defectRefId} for ${defect.defect_id} (${defect.assigned_by_name} → ${defect.assigned_to_name})`);
        } catch (error) {
          console.log(`❌ Error adding defect_history for ${defect.defect_id}: ${error.message}`);
        }
      }
    }

    // Add additional status change records for some defects
    console.log('\n📝 Adding status change history records...');
    
    const statusChanges = [
      {
        defect_ref_id: 'DH001_V2',
        defect_id: 1,
        assigned_by: 'John',
        assigned_to: 'Jane',
        defect_status: 'In Progress',
        previous_status: 'Open',
        defect_date: '2024-01-20',
        defect_time: '14:30:00'
      },
      {
        defect_ref_id: 'DH002_V2',
        defect_id: 2,
        assigned_by: 'Jane',
        assigned_to: 'Mike',
        defect_status: 'Resolved',
        previous_status: 'In Progress',
        defect_date: '2024-01-25',
        defect_time: '16:45:00'
      },
      {
        defect_ref_id: 'DH003_V2',
        defect_id: 3,
        assigned_by: 'Mike',
        assigned_to: 'John',
        defect_status: 'Closed',
        previous_status: 'Resolved',
        defect_date: '2024-01-30',
        defect_time: '11:15:00'
      }
    ];

    for (const change of statusChanges) {
      try {
        await sequelize.query(`
          INSERT INTO defect_history (
            defect_ref_id, defect_id, assigned_by, assigned_to,
            defect_date, defect_time, defect_status, previous_status,
            record_status, release_id
          ) VALUES (
            '${change.defect_ref_id}', ${change.defect_id}, '${change.assigned_by}', '${change.assigned_to}',
            '${change.defect_date}', '${change.defect_time}', '${change.defect_status}', '${change.previous_status}',
            'Active', 1
          )
        `);
        console.log(`✅ Added status change: ${change.defect_ref_id} - ${change.previous_status} → ${change.defect_status}`);
      } catch (error) {
        console.log(`❌ Error adding status change ${change.defect_ref_id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final defect_history verification:');
    const [finalHistory] = await sequelize.query(`
      SELECT dh.id, dh.defect_ref_id, dh.defect_id, d.defect_id as defect_code,
             dh.defect_status, dh.previous_status, dh.assigned_by, dh.assigned_to
      FROM defect_history dh
      LEFT JOIN defect d ON dh.defect_id = d.id
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
        console.log(`    - ${r.defect_ref_id}: ${r.previous_status} → ${r.defect_status} (${r.assigned_by} → ${r.assigned_to})`);
      });
    });

    // Coverage check
    const [coverageCheck] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM defect) as total_defects,
        (SELECT COUNT(DISTINCT defect_id) FROM defect_history) as defects_with_history,
        (SELECT COUNT(*) FROM defect_history) as total_history_records
    `);
    
    console.log(`\n📊 Final coverage check:`);
    console.log(`  Total defects: ${coverageCheck[0].total_defects}`);
    console.log(`  Defects with history: ${coverageCheck[0].defects_with_history}`);
    console.log(`  Total history records: ${coverageCheck[0].total_history_records}`);
    
    if (coverageCheck[0].total_defects === coverageCheck[0].defects_with_history) {
      console.log('✅ All defects now have history records!');
    } else {
      console.log('❌ Some defects still missing history records');
    }

    console.log('\n🎉 Successfully populated complete defect_history table!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

populateDefectHistoryComplete();
