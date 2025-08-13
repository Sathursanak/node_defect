const sequelize = require('./db');

async function fixAllRemainingNulls() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 Fixing all remaining NULL foreign keys...\n');

    // Fix allocate_module table - the main issue
    console.log('📝 Fixing allocate_module table...');
    
    // Update each record with proper user_id and project_id
    await sequelize.query(`UPDATE allocate_module SET user_id = 1, project_id = 3 WHERE id = 10`);
    await sequelize.query(`UPDATE allocate_module SET user_id = 2, project_id = 3 WHERE id = 11`);
    await sequelize.query(`UPDATE allocate_module SET user_id = 3, project_id = 4 WHERE id = 12`);
    
    console.log('✅ Fixed allocate_module foreign keys');

    // Add more data to tables that only have 1 record to make them more realistic
    console.log('\n📝 Adding more data to tables with only 1 record...');

    // Add more email_user records
    await sequelize.query(`
      INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) VALUES
      (1, 1, 0, 1, 2),
      (0, 1, 1, 0, 3)
    `);
    console.log('✅ Added more email_user records');

    // Add more group_privilege records
    await sequelize.query(`
      INSERT INTO group_privilege (privilege_id, role_id) VALUES
      (6, 2),
      (7, 4),
      (8, 5)
    `);
    console.log('✅ Added more group_privilege records');

    // Add more project_allocation records
    await sequelize.query(`
      INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES
      (80, '2024-01-01', '2024-12-31', 3, 2, 4),
      (100, '2024-02-01', '2024-11-30', 4, 3, 2),
      (60, '2024-03-01', '2024-08-15', 4, 1, 5)
    `);
    console.log('✅ Added more project_allocation records');

    // Add more project_allocation_history records
    await sequelize.query(`
      INSERT INTO project_allocation_history (percentage, start_date, end_date, status, project_id, user_id, role_id) VALUES
      (75, '2024-01-01', '2024-06-30', 1, 3, 3, 4),
      (100, '2024-02-01', '2024-12-31', 1, 4, 1, 2)
    `);
    console.log('✅ Added more project_allocation_history records');

    // Add more project_user_privilege records
    await sequelize.query(`
      INSERT INTO project_user_privilege (privilege_id, project_id, user_id, createdAt, updatedAt) VALUES
      (6, 3, 2, NOW(), NOW()),
      (7, 4, 3, NOW(), NOW())
    `);
    console.log('✅ Added more project_user_privilege records');

    // Add more user_privilege records
    await sequelize.query(`
      INSERT INTO user_privilege (user_Id, project_id, privilege_id) VALUES
      (2, 3, 6),
      (3, 4, 7),
      (1, 4, 8)
    `);
    console.log('✅ Added more user_privilege records');

    // Add more release_test_case records
    await sequelize.query(`
      INSERT INTO release_test_case (release_test_case_id, description, test_case_status, test_date, test_time, release_id, test_case_id, user_id) VALUES
      ('RTC002', 'User registration test case', 'PASSED', '2024-01-20', '14:30:00', 1, 4, 2),
      ('RTC003', 'Project dashboard test case', 'FAILED', '2024-01-21', '10:15:00', 1, 3, 3)
    `);
    console.log('✅ Added more release_test_case records');

    // Add more releases
    await sequelize.query(`
      INSERT INTO releases (release_id, release_name, releasedate, status, releases_id, release_type_id) VALUES
      ('REL002', 'Version 1.1', '2024-07-01', 1, NULL, 2),
      ('REL003', 'Version 1.2', '2024-08-01', 0, NULL, 3)
    `);
    console.log('✅ Added more releases');

    // Add more comments
    await sequelize.query(`
      INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES
      ('This defect needs immediate attention', NULL, 3, 1),
      ('Fixed in latest build, please verify', NULL, 1, 2),
      ('Unable to reproduce this issue', NULL, 2, 3)
    `);
    console.log('✅ Added more comments');

    // Add more bench records
    await sequelize.query(`
      INSERT INTO bench (bench_id, allocated, availability, user_id) VALUES
      ('BENCH003', 1, 0, 3),
      ('BENCH004', 0, 1, 1),
      ('BENCH005', 1, 0, 2)
    `);
    console.log('✅ Added more bench records');

    console.log('\n🎉 All NULL foreign keys have been fixed and more data added!');

    // Verification
    console.log('\n📊 Verification - checking allocate_module table:');
    const [allocateModule] = await sequelize.query('SELECT id, user_id, modules_id, sub_module_id, project_id FROM allocate_module');
    allocateModule.forEach(a => {
      console.log(`  ID: ${a.id}, user_id: ${a.user_id}, modules_id: ${a.modules_id}, sub_module_id: ${a.sub_module_id}, project_id: ${a.project_id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAllRemainingNulls();
