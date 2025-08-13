const sequelize = require('./db');

async function checkAndFixDefectHistory() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check defect_history table structure
    console.log('📊 Checking defect_history table structure:');
    const [columns] = await sequelize.query('DESCRIBE defect_history');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key}`);
    });

    // Check current data
    console.log('\n📋 Current defect_history data:');
    const [currentHistory] = await sequelize.query('SELECT * FROM defect_history');
    console.log(`Current records: ${currentHistory.length}`);
    currentHistory.forEach(dh => {
      console.log(`  ID: ${dh.id}, defect_ref_id: ${dh.defect_ref_id}, defect_id: ${dh.defect_id}`);
    });

    // Get all defects
    const [allDefects] = await sequelize.query('SELECT id, defect_id FROM defect ORDER BY id');
    console.log(`\nTotal defects: ${allDefects.length}`);

    // Add simple defect_history records for missing defects
    console.log('\n📝 Adding simple defect_history records...');
    
    const existingDefectIds = currentHistory.map(dh => dh.defect_id);
    const missingDefects = allDefects.filter(d => !existingDefectIds.includes(d.id));
    
    console.log(`Missing defects: ${missingDefects.length}`);
    
    for (const defect of missingDefects) {
      try {
        const defectRefId = `DH${String(defect.id).padStart(3, '0')}`;
        
        await sequelize.query(`
          INSERT INTO defect_history (defect_ref_id, defect_id) 
          VALUES ('${defectRefId}', ${defect.id})
        `);
        console.log(`✅ Added defect_history: ${defectRefId} for defect ${defect.defect_id}`);
      } catch (error) {
        console.log(`❌ Error adding defect_history for ${defect.defect_id}: ${error.message}`);
      }
    }

    // Final verification
    console.log('\n📊 Final verification:');
    const [finalHistory] = await sequelize.query(`
      SELECT dh.id, dh.defect_ref_id, dh.defect_id, d.defect_id as defect_code
      FROM defect_history dh
      LEFT JOIN defect d ON dh.defect_id = d.id
      ORDER BY dh.defect_id
    `);
    
    console.log(`Total defect_history records: ${finalHistory.length}`);
    finalHistory.forEach(dh => {
      console.log(`  ${dh.defect_ref_id}: ${dh.defect_code} (defect_id: ${dh.defect_id})`);
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
      console.log('❌ Some defects still missing history records');
    }

    console.log('\n🎉 Defect history table updated!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAndFixDefectHistory();
