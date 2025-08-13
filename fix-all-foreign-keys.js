const sequelize = require('./db');

async function fixAllForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 Fixing all NULL foreign key relationships...\n');

    // 1. Fix comments table - link to defects and users
    console.log('📝 Fixing comments table...');
    await sequelize.query(`
      UPDATE comments SET defect_id = 4, user_id = 1 WHERE id = 1;
      UPDATE comments SET defect_id = 5, user_id = 2 WHERE id = 2;
    `);
    console.log('✅ Fixed comments foreign keys');

    // 2. Fix email_user table - link to users
    console.log('📝 Fixing email_user table...');
    await sequelize.query(`
      UPDATE email_user SET user_id = 1 WHERE id = 1;
    `);
    console.log('✅ Fixed email_user foreign keys');

    // 3. Fix group_privilege table - link to privileges and roles
    console.log('📝 Fixing group_privilege table...');
    await sequelize.query(`
      UPDATE group_privilege SET privilege_id = 5, role_id = 1 WHERE id = 1;
    `);
    console.log('✅ Fixed group_privilege foreign keys');

    // 4. Fix project_allocation table - link to projects, users, and roles
    console.log('📝 Fixing project_allocation table...');
    await sequelize.query(`
      UPDATE project_allocation SET project_id = 1, user_id = 1, role_id = 4 WHERE id = 1;
    `);
    console.log('✅ Fixed project_allocation foreign keys');

    // 5. Fix project_allocation_history table
    console.log('📝 Fixing project_allocation_history table...');
    await sequelize.query(`
      UPDATE project_allocation_history SET project_id = 1, user_id = 2, role_id = 3 WHERE id = 1;
    `);
    console.log('✅ Fixed project_allocation_history foreign keys');

    // 6. Fix project_user_privilege table
    console.log('📝 Fixing project_user_privilege table...');
    await sequelize.query(`
      UPDATE project_user_privilege SET privilege_id = 6, project_id = 1, user_id = 1 WHERE id = 1;
    `);
    console.log('✅ Fixed project_user_privilege foreign keys');

    // 7. Fix user_privilege table
    console.log('📝 Fixing user_privilege table...');
    await sequelize.query(`
      UPDATE user_privilege SET user_Id = 1, project_id = 1, privilege_id = 7 WHERE id = 1;
    `);
    console.log('✅ Fixed user_privilege foreign keys');

    // 8. Fix modules table - link to projects
    console.log('📝 Fixing modules table...');
    await sequelize.query(`
      UPDATE modules SET project_id = 1 WHERE id IN (6, 7);
      UPDATE modules SET project_id = 2 WHERE id IN (8, 9);
      UPDATE modules SET project_id = 3 WHERE id = 10;
    `);
    console.log('✅ Fixed modules foreign keys');

    // 9. Fix test_case table - the first one that has NULLs
    console.log('📝 Fixing test_case table...');
    await sequelize.query(`
      UPDATE test_case SET defect_type_id = 11, modules_id = 6, project_id = 1, severity_id = 2, sub_module_id = 6 WHERE id = 1;
    `);
    console.log('✅ Fixed test_case foreign keys');

    // 10. Fix release_test_case table
    console.log('📝 Fixing release_test_case table...');
    await sequelize.query(`
      UPDATE release_test_case SET release_id = 1, test_case_id = 1, user_id = 1 WHERE id = 1;
    `);
    console.log('✅ Fixed release_test_case foreign keys');

    // 11. Fix releases table
    console.log('📝 Fixing releases table...');
    await sequelize.query(`
      UPDATE releases SET release_type_id = 1 WHERE id = 1;
    `);
    console.log('✅ Fixed releases foreign keys');

    // 12. Add more data with proper foreign keys
    console.log('📝 Adding more data with proper foreign keys...');
    
    // Add more email_user records
    await sequelize.query(`
      INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) VALUES
      (1, 1, 0, 1, 2),
      (0, 1, 1, 0, 3),
      (1, 0, 1, 1, 4);
    `);
    console.log('✅ Added more email_user records');

    // Add more group_privilege records
    await sequelize.query(`
      INSERT INTO group_privilege (privilege_id, role_id) VALUES
      (6, 2),
      (7, 3),
      (8, 4),
      (9, 5);
    `);
    console.log('✅ Added more group_privilege records');

    // Add more project_allocation records
    await sequelize.query(`
      INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES
      (80, '2024-01-01', '2024-12-31', 1, 2, 4),
      (100, '2024-02-01', '2024-11-30', 2, 3, 3),
      (60, '2024-03-01', '2024-08-15', 3, 4, 5),
      (90, '2024-01-15', '2024-12-31', 1, 5, 2);
    `);
    console.log('✅ Added more project_allocation records');

    // Add more user_privilege records
    await sequelize.query(`
      INSERT INTO user_privilege (user_Id, project_id, privilege_id) VALUES
      (2, 1, 8),
      (3, 2, 9),
      (4, 3, 10),
      (5, 1, 5);
    `);
    console.log('✅ Added more user_privilege records');

    // Add more comments with proper foreign keys
    await sequelize.query(`
      INSERT INTO comments (comment, attachment, defect_id, user_id) VALUES
      ('This defect needs immediate attention', NULL, 6, 1),
      ('Fixed in latest build, please verify', NULL, 7, 2),
      ('Unable to reproduce this issue', NULL, 8, 3),
      ('Assigned to development team', NULL, 4, 4);
    `);
    console.log('✅ Added more comments with proper foreign keys');

    console.log('\n🎉 All foreign key relationships have been fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAllForeignKeys();
