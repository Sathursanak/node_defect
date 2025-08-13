const sequelize = require('./db');

async function fixRemainingNullsSimple() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 Fixing remaining issues...\n');

    // Add more releases (this should work)
    console.log('📝 Adding more releases...');
    await sequelize.query(`
      INSERT INTO releases (release_id, release_name, releasedate, status, releases_id, release_type_id) VALUES
      ('REL002', 'Version 1.1', '2024-07-01', 1, NULL, 2),
      ('REL003', 'Version 1.2', '2024-08-01', 0, NULL, 3)
    `);
    console.log('✅ Added more releases');

    // Add more comments
    console.log('📝 Adding more comments...');
    await sequelize.query(`
      INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES
      ('This defect needs immediate attention', NULL, 3, 1),
      ('Fixed in latest build, please verify', NULL, 1, 2),
      ('Unable to reproduce this issue', NULL, 2, 3)
    `);
    console.log('✅ Added more comments');

    // Add more bench records
    console.log('📝 Adding more bench records...');
    await sequelize.query(`
      INSERT INTO bench (bench_id, allocated, availability, user_id) VALUES
      ('BENCH003', 1, 0, 3),
      ('BENCH004', 0, 1, 1),
      ('BENCH005', 1, 0, 2)
    `);
    console.log('✅ Added more bench records');

    // Add simple release_test_case records
    console.log('📝 Adding more release_test_case records...');
    await sequelize.query(`
      INSERT INTO release_test_case (release_test_case_id, description, test_case_status, test_date, test_time, release_id, test_case_id, user_id) VALUES
      ('RTC002', 'User registration test case', 'NEW', NULL, NULL, 1, 4, 2),
      ('RTC003', 'Project dashboard test case', 'NEW', NULL, NULL, 1, 3, 3)
    `);
    console.log('✅ Added more release_test_case records');

    console.log('\n🎉 Successfully added more data!');

    // Final verification of allocate_module
    console.log('\n📊 Final verification - allocate_module table:');
    const [allocateModule] = await sequelize.query('SELECT id, user_id, modules_id, sub_module_id, project_id FROM allocate_module');
    allocateModule.forEach(a => {
      console.log(`  ID: ${a.id}, user_id: ${a.user_id}, modules_id: ${a.modules_id}, sub_module_id: ${a.sub_module_id}, project_id: ${a.project_id}`);
    });

    // Check if any NULLs remain
    console.log('\n🔍 Checking for any remaining NULLs in key tables:');
    
    const [nullCheck] = await sequelize.query(`
      SELECT 
        'allocate_module' as table_name,
        COUNT(*) as total_records,
        SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as null_user_id,
        SUM(CASE WHEN project_id IS NULL THEN 1 ELSE 0 END) as null_project_id
      FROM allocate_module
    `);
    
    console.log('Allocate Module NULL check:', nullCheck[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixRemainingNullsSimple();
