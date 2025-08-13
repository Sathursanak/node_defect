const sequelize = require('./db');

async function populateDefectHistory() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current defect_history data
    console.log('📊 Current defect_history data:');
    const [currentHistory] = await sequelize.query('SELECT * FROM defect_history');
    console.log(`Current defect_history records: ${currentHistory.length}`);
    currentHistory.forEach(dh => {
      console.log(`  ID: ${dh.id}, defect_ref_id: ${dh.defect_ref_id}, defect_id: ${dh.defect_id}`);
    });

    // Get all defects
    console.log('\n📋 All defects in defect table:');
    const [allDefects] = await sequelize.query('SELECT id, defect_id, description FROM defect ORDER BY id');
    console.log(`Total defects: ${allDefects.length}`);
    allDefects.forEach(d => {
      console.log(`  ID: ${d.id}, ${d.defect_id}: ${d.description.substring(0, 50)}...`);
    });

    // Check which defects are missing from defect_history
    console.log('\n🔍 Checking which defects are missing from defect_history...');
    const existingDefectIds = currentHistory.map(dh => dh.defect_id);
    const missingDefects = allDefects.filter(d => !existingDefectIds.includes(d.id));
    
    console.log(`Missing defects in history: ${missingDefects.length}`);
    missingDefects.forEach(d => {
      console.log(`  Missing: ${d.defect_id} (ID: ${d.id})`);
    });

    // Add missing defects to defect_history
    console.log('\n📝 Adding missing defects to defect_history...');
    
    for (const defect of missingDefects) {
      try {
        // Generate a unique defect_ref_id
        const defectRefId = `DH${String(defect.id).padStart(3, '0')}`;
        
        await sequelize.query(`
          INSERT INTO defect_history (defect_ref_id, defect_id) 
          VALUES ('${defectRefId}', ${defect.id})
        `);
        console.log(`✅ Added defect_history: ${defectRefId} for defect ${defect.defect_id} (ID: ${defect.id})`);
      } catch (error) {
        console.log(`❌ Error adding defect_history for defect ${defect.defect_id}: ${error.message}`);
      }
    }

    // Add additional history records for some defects (showing status changes)
    console.log('\n📝 Adding additional history records for status changes...');
    
    const additionalHistory = [
      { defect_ref_id: 'DH001_V2', defect_id: allDefects[0].id },
      { defect_ref_id: 'DH002_V2', defect_id: allDefects[1].id },
      { defect_ref_id: 'DH003_V2', defect_id: allDefects[2].id },
      { defect_ref_id: 'DH004_V2', defect_id: allDefects[3].id },
      { defect_ref_id: 'DH005_V2', defect_id: allDefects[4].id }
    ];

    for (const history of additionalHistory) {
      try {
        await sequelize.query(`
          INSERT INTO defect_history (defect_ref_id, defect_id) 
          VALUES ('${history.defect_ref_id}', ${history.defect_id})
        `);
        console.log(`✅ Added additional history: ${history.defect_ref_id} for defect ID ${history.defect_id}`);
      } catch (error) {
        console.log(`❌ Error adding additional history ${history.defect_ref_id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final defect_history verification:');
    const [finalHistory] = await sequelize.query(`
      SELECT dh.id, dh.defect_ref_id, dh.defect_id, d.defect_id as defect_code, d.description
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
      console.log(`  ${defectCode}: ${records.length} history record(s)`);
      records.forEach(r => {
        console.log(`    - ${r.defect_ref_id} (History ID: ${r.id})`);
      });
    });

    // Check if all defects have at least one history record
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

    console.log('\n🎉 Successfully populated defect_history table!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

populateDefectHistory();
