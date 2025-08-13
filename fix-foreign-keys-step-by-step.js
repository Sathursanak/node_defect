const sequelize = require('./db');

async function fixForeignKeysStepByStep() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔧 Fixing all NULL foreign key relationships step by step...\n');

    // 1. Fix comments table - link to defects and users
    console.log('📝 Fixing comments table...');
    await sequelize.query(`UPDATE comments SET defect_id = 4, user_id = 1 WHERE id = 1`);
    await sequelize.query(`UPDATE comments SET defect_id = 5, user_id = 2 WHERE id = 2`);
    console.log('✅ Fixed comments foreign keys');

    // 2. Fix email_user table - link to users
    console.log('📝 Fixing email_user table...');
    await sequelize.query(`UPDATE email_user SET user_id = 1 WHERE id = 1`);
    console.log('✅ Fixed email_user foreign keys');

    // 3. Fix group_privilege table - link to privileges and roles
    console.log('📝 Fixing group_privilege table...');
    await sequelize.query(`UPDATE group_privilege SET privilege_id = 5, role_id = 1 WHERE id = 1`);
    console.log('✅ Fixed group_privilege foreign keys');

    // 4. Fix project_allocation table - link to projects, users, and roles
    console.log('📝 Fixing project_allocation table...');
    await sequelize.query(`UPDATE project_allocation SET project_id = 1, user_id = 1, role_id = 4 WHERE id = 1`);
    console.log('✅ Fixed project_allocation foreign keys');

    // 5. Fix project_allocation_history table
    console.log('📝 Fixing project_allocation_history table...');
    await sequelize.query(`UPDATE project_allocation_history SET project_id = 1, user_id = 2, role_id = 3 WHERE id = 1`);
    console.log('✅ Fixed project_allocation_history foreign keys');

    // 6. Fix project_user_privilege table
    console.log('📝 Fixing project_user_privilege table...');
    await sequelize.query(`UPDATE project_user_privilege SET privilege_id = 6, project_id = 1, user_id = 1 WHERE id = 1`);
    console.log('✅ Fixed project_user_privilege foreign keys');

    // 7. Fix user_privilege table
    console.log('📝 Fixing user_privilege table...');
    await sequelize.query(`UPDATE user_privilege SET user_Id = 1, project_id = 1, privilege_id = 7 WHERE id = 1`);
    console.log('✅ Fixed user_privilege foreign keys');

    // 8. Fix modules table - link to projects
    console.log('📝 Fixing modules table...');
    await sequelize.query(`UPDATE modules SET project_id = 1 WHERE id = 6`);
    await sequelize.query(`UPDATE modules SET project_id = 1 WHERE id = 7`);
    await sequelize.query(`UPDATE modules SET project_id = 2 WHERE id = 8`);
    await sequelize.query(`UPDATE modules SET project_id = 2 WHERE id = 9`);
    await sequelize.query(`UPDATE modules SET project_id = 3 WHERE id = 10`);
    console.log('✅ Fixed modules foreign keys');

    // 9. Fix test_case table - the first one that has NULLs
    console.log('📝 Fixing test_case table...');
    await sequelize.query(`UPDATE test_case SET defect_type_id = 11, modules_id = 6, project_id = 1, severity_id = 2, sub_module_id = 6 WHERE id = 1`);
    console.log('✅ Fixed test_case foreign keys');

    // 10. Fix release_test_case table
    console.log('📝 Fixing release_test_case table...');
    await sequelize.query(`UPDATE release_test_case SET release_id = 1, test_case_id = 1, user_id = 1 WHERE id = 1`);
    console.log('✅ Fixed release_test_case foreign keys');

    // 11. Fix releases table
    console.log('📝 Fixing releases table...');
    await sequelize.query(`UPDATE releases SET release_type_id = 1 WHERE id = 1`);
    console.log('✅ Fixed releases foreign keys');

    // 12. Fix allocate_module table
    console.log('📝 Fixing allocate_module table...');
    await sequelize.query(`UPDATE allocate_module SET user_id = 1, project_id = 1 WHERE id = 1`);
    await sequelize.query(`UPDATE allocate_module SET user_id = 2, project_id = 1 WHERE id = 2`);
    await sequelize.query(`UPDATE allocate_module SET user_id = 3, project_id = 2 WHERE id = 3`);
    await sequelize.query(`UPDATE allocate_module SET user_id = 4, project_id = 2 WHERE id = 4`);
    console.log('✅ Fixed allocate_module foreign keys');

    // 13. Fix bench table
    console.log('📝 Fixing bench table...');
    await sequelize.query(`UPDATE bench SET user_id = 1 WHERE id = 1`);
    await sequelize.query(`UPDATE bench SET user_id = 2 WHERE id = 2`);
    await sequelize.query(`UPDATE bench SET user_id = 3 WHERE id = 3`);
    await sequelize.query(`UPDATE bench SET user_id = 4 WHERE id = 4`);
    await sequelize.query(`UPDATE bench SET user_id = 5 WHERE id = 5`);
    console.log('✅ Fixed bench foreign keys');

    console.log('\n🎉 All foreign key relationships have been fixed!');

    // Verification
    console.log('\n📊 Verification - checking some key tables:');
    
    const [comments] = await sequelize.query('SELECT id, defect_id, user_id FROM comments LIMIT 3');
    console.log('Comments:', comments);
    
    const [modules] = await sequelize.query('SELECT id, module_name, project_id FROM modules LIMIT 3');
    console.log('Modules:', modules);
    
    const [allocations] = await sequelize.query('SELECT id, user_id, project_id FROM project_allocation LIMIT 3');
    console.log('Project Allocations:', allocations);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixForeignKeysStepByStep();
