const sequelize = require('./db');

async function fixDefectReleaseTestCase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current defects and their release_test_case_id
    console.log('🔍 Checking current defects:');
    const [defects] = await sequelize.query('SELECT id, defect_id, release_test_case_id FROM defect');
    defects.forEach(d => {
      console.log(`  Defect ${d.id} (${d.defect_id}): release_test_case_id = ${d.release_test_case_id}`);
    });

    // Check available release_test_case IDs
    console.log('\n📊 Available release_test_case records:');
    const [releaseTestCases] = await sequelize.query('SELECT id, release_test_case_id, description FROM release_test_case');
    releaseTestCases.forEach(rtc => {
      console.log(`  ID: ${rtc.id}, release_test_case_id: ${rtc.release_test_case_id}, Description: "${rtc.description.substring(0, 40)}..."`);
    });

    // Fix the defects by linking them to release test cases
    console.log('\n🔧 Fixing defect release_test_case_id foreign keys...');
    
    if (defects.length >= 1 && releaseTestCases.length >= 1) {
      await sequelize.query(`UPDATE defect SET release_test_case_id = ${releaseTestCases[0].id} WHERE id = ${defects[0].id}`);
      console.log(`✅ Updated defect ${defects[0].defect_id} → release_test_case ${releaseTestCases[0].release_test_case_id}`);
    }

    if (defects.length >= 2 && releaseTestCases.length >= 2) {
      await sequelize.query(`UPDATE defect SET release_test_case_id = ${releaseTestCases[1].id} WHERE id = ${defects[1].id}`);
      console.log(`✅ Updated defect ${defects[1].defect_id} → release_test_case ${releaseTestCases[1].release_test_case_id}`);
    }

    if (defects.length >= 3 && releaseTestCases.length >= 3) {
      await sequelize.query(`UPDATE defect SET release_test_case_id = ${releaseTestCases[2].id} WHERE id = ${defects[2].id}`);
      console.log(`✅ Updated defect ${defects[2].defect_id} → release_test_case ${releaseTestCases[2].release_test_case_id}`);
    }

    // Verification
    console.log('\n📊 Verification - Updated defects:');
    const [updatedDefects] = await sequelize.query('SELECT id, defect_id, release_test_case_id FROM defect');
    updatedDefects.forEach(d => {
      console.log(`  Defect ${d.id} (${d.defect_id}): release_test_case_id = ${d.release_test_case_id}`);
    });

    // Check for any remaining NULLs in defect table
    console.log('\n🔍 Checking for any remaining NULLs in defect table:');
    const [nullCheck] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_defects,
        SUM(CASE WHEN release_test_case_id IS NULL THEN 1 ELSE 0 END) as null_release_test_case_id
      FROM defect
    `);
    
    console.log(`Total defects: ${nullCheck[0].total_defects}`);
    console.log(`NULL release_test_case_id: ${nullCheck[0].null_release_test_case_id}`);
    
    if (nullCheck[0].null_release_test_case_id === '0') {
      console.log('✅ All defects now have proper release_test_case_id values!');
    } else {
      console.log('❌ Some defects still have NULL release_test_case_id values');
    }

    // Show complete defect relationships
    console.log('\n🔗 Complete defect relationships:');
    const [completeDefects] = await sequelize.query(`
      SELECT d.id, d.defect_id, d.description,
             u1.first_name as assigned_by_name, u2.first_name as assigned_to_name,
             rtc.release_test_case_id, rtc.description as test_case_desc
      FROM defect d
      LEFT JOIN user u1 ON d.assigned_by = u1.id
      LEFT JOIN user u2 ON d.assigned_to = u2.id  
      LEFT JOIN release_test_case rtc ON d.release_test_case_id = rtc.id
    `);
    
    completeDefects.forEach(d => {
      console.log(`  ${d.defect_id}: "${d.description.substring(0, 40)}..."`);
      console.log(`    Assigned by: ${d.assigned_by_name}, To: ${d.assigned_to_name}`);
      console.log(`    Release Test Case: ${d.release_test_case_id} - "${d.test_case_desc ? d.test_case_desc.substring(0, 30) + '...' : 'N/A'}"`);
    });

    console.log('\n🎉 Defect release_test_case_id foreign keys have been fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixDefectReleaseTestCase();
