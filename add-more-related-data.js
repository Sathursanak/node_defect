const sequelize = require('./db');

async function addMoreRelatedData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('📝 Adding more data with proper foreign key relationships...\n');

    // 1. Add more email_user records
    console.log('📧 Adding more email_user records...');
    await sequelize.query(`INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) VALUES (1, 1, 0, 1, 2)`);
    await sequelize.query(`INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) VALUES (0, 1, 1, 0, 3)`);
    await sequelize.query(`INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) VALUES (1, 0, 1, 1, 4)`);
    console.log('✅ Added 3 more email_user records');

    // 2. Add more group_privilege records
    console.log('🔐 Adding more group_privilege records...');
    await sequelize.query(`INSERT INTO group_privilege (privilege_id, role_id) VALUES (6, 2)`);
    await sequelize.query(`INSERT INTO group_privilege (privilege_id, role_id) VALUES (7, 3)`);
    await sequelize.query(`INSERT INTO group_privilege (privilege_id, role_id) VALUES (8, 4)`);
    await sequelize.query(`INSERT INTO group_privilege (privilege_id, role_id) VALUES (9, 5)`);
    console.log('✅ Added 4 more group_privilege records');

    // 3. Add more project_allocation records
    console.log('📊 Adding more project_allocation records...');
    await sequelize.query(`INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES (80, '2024-01-01', '2024-12-31', 1, 2, 4)`);
    await sequelize.query(`INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES (100, '2024-02-01', '2024-11-30', 2, 3, 3)`);
    await sequelize.query(`INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES (60, '2024-03-01', '2024-08-15', 3, 4, 5)`);
    await sequelize.query(`INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES (90, '2024-01-15', '2024-12-31', 1, 5, 2)`);
    console.log('✅ Added 4 more project_allocation records');

    // 4. Add more project_allocation_history records
    console.log('📈 Adding more project_allocation_history records...');
    await sequelize.query(`INSERT INTO project_allocation_history (percentage, start_date, end_date, status, project_id, user_id, role_id) VALUES (75, '2024-01-01', '2024-06-30', 1, 1, 3, 4)`);
    await sequelize.query(`INSERT INTO project_allocation_history (percentage, start_date, end_date, status, project_id, user_id, role_id) VALUES (100, '2024-02-01', '2024-12-31', 1, 2, 4, 3)`);
    await sequelize.query(`INSERT INTO project_allocation_history (percentage, start_date, end_date, status, project_id, user_id, role_id) VALUES (50, '2024-03-01', '2024-09-30', 0, 3, 5, 5)`);
    console.log('✅ Added 3 more project_allocation_history records');

    // 5. Add more user_privilege records
    console.log('👤 Adding more user_privilege records...');
    await sequelize.query(`INSERT INTO user_privilege (user_Id, project_id, privilege_id) VALUES (2, 1, 8)`);
    await sequelize.query(`INSERT INTO user_privilege (user_Id, project_id, privilege_id) VALUES (3, 2, 9)`);
    await sequelize.query(`INSERT INTO user_privilege (user_Id, project_id, privilege_id) VALUES (4, 3, 10)`);
    await sequelize.query(`INSERT INTO user_privilege (user_Id, project_id, privilege_id) VALUES (5, 1, 5)`);
    console.log('✅ Added 4 more user_privilege records');

    // 6. Add more project_user_privilege records
    console.log('🔑 Adding more project_user_privilege records...');
    await sequelize.query(`INSERT INTO project_user_privilege (privilege_id, project_id, user_id, createdAt, updatedAt) VALUES (7, 1, 2, NOW(), NOW())`);
    await sequelize.query(`INSERT INTO project_user_privilege (privilege_id, project_id, user_id, createdAt, updatedAt) VALUES (8, 2, 3, NOW(), NOW())`);
    await sequelize.query(`INSERT INTO project_user_privilege (privilege_id, project_id, user_id, createdAt, updatedAt) VALUES (9, 3, 4, NOW(), NOW())`);
    console.log('✅ Added 3 more project_user_privilege records');

    // 7. Add more comments with proper foreign keys
    console.log('💬 Adding more comments...');
    await sequelize.query(`INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES ('This defect needs immediate attention', NULL, 6, 1)`);
    await sequelize.query(`INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES ('Fixed in latest build, please verify', NULL, 7, 2)`);
    await sequelize.query(`INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES ('Unable to reproduce this issue', NULL, 8, 3)`);
    await sequelize.query(`INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES ('Assigned to development team', NULL, 4, 4)`);
    console.log('✅ Added 4 more comments');

    // 8. Add more release_test_case records
    console.log('🧪 Adding more release_test_case records...');
    await sequelize.query(`INSERT INTO release_test_case (release_test_case_id, description, test_case_status, test_date, test_time, release_id, test_case_id, user_id) VALUES ('RTC002', 'User registration test case', 'PASSED', '2024-01-20', '14:30:00', 1, 2, 2)`);
    await sequelize.query(`INSERT INTO release_test_case (release_test_case_id, description, test_case_status, test_date, test_time, release_id, test_case_id, user_id) VALUES ('RTC003', 'Project dashboard test case', 'FAILED', '2024-01-21', '10:15:00', 1, 3, 3)`);
    await sequelize.query(`INSERT INTO release_test_case (release_test_case_id, description, test_case_status, test_date, test_time, release_id, test_case_id, user_id) VALUES ('RTC004', 'Password validation test case', 'NEW', NULL, NULL, 1, 4, 4)`);
    console.log('✅ Added 3 more release_test_case records');

    // 9. Add more releases
    console.log('🚀 Adding more releases...');
    await sequelize.query(`INSERT INTO releases (release_id, release_name, releasedate, status, releases_id, release_type_id) VALUES ('REL002', 'Version 1.1', '2024-07-01', 1, NULL, 2)`);
    await sequelize.query(`INSERT INTO releases (release_id, release_name, releasedate, status, releases_id, release_type_id) VALUES ('REL003', 'Version 1.2', '2024-08-01', 0, NULL, 3)`);
    console.log('✅ Added 2 more releases');

    console.log('\n🎉 Successfully added comprehensive data with proper foreign key relationships!');

    // Final verification
    console.log('\n📊 Final verification of record counts:');
    const tables = [
      'user', 'project', 'defect', 'comments', 'email_user', 
      'group_privilege', 'project_allocation', 'user_privilege',
      'project_user_privilege', 'release_test_case', 'releases'
    ];
    
    for (const table of tables) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`  ${table}: ${result[0].count} records`);
      } catch (error) {
        console.log(`  ${table}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addMoreRelatedData();
