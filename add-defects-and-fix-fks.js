const sequelize = require('./db');

async function addDefectsAndFixForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current IDs
    console.log('📊 Checking current IDs...');
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [modules] = await sequelize.query('SELECT id, module_id FROM modules');
    
    console.log('Users:', users.map(u => `${u.id}(${u.user_id})`));
    console.log('Projects:', projects.map(p => `${p.id}(${p.project_id})`));
    console.log('Modules:', modules.map(m => `${m.id}(${m.module_id})`));

    // 1. Add defects with correct foreign keys
    console.log('\n🐛 Adding defects with proper foreign keys...');
    await sequelize.query(`
      INSERT INTO defect (defect_id, description, steps, attachment, re_open_count, assigned_by, assigned_to, defect_type_id, defect_status_id, modules_id, priority_id, project_id, severity_id, sub_module_id) VALUES
      ('DEF001', 'Login button not working', '1. Go to login page 2. Enter credentials 3. Click login button', NULL, 0, ${users[0].id}, ${users[1].id}, 1, 1, ${modules[0].id}, 1, ${projects[0].id}, 1, 6),
      ('DEF002', 'Password reset email not sent', '1. Click forgot password 2. Enter email 3. Submit form', NULL, 0, ${users[1].id}, ${users[2].id}, 1, 2, ${modules[1].id}, 2, ${projects[0].id}, 2, 7),
      ('DEF003', 'Project creation form validation error', '1. Go to create project 2. Leave required fields empty 3. Submit', NULL, 1, ${users[0].id}, ${users[1].id}, 1, 1, ${modules[2].id}, 3, ${projects[1].id}, 3, 9)
    `);
    console.log('✅ Added 3 defects');

    // 2. Fix foreign keys in existing tables
    console.log('\n🔧 Fixing foreign keys in existing tables...');
    
    // Fix comments
    await sequelize.query(`UPDATE comments SET defect_id = 1, user_id = ${users[0].id} WHERE id = 1`);
    await sequelize.query(`UPDATE comments SET defect_id = 2, user_id = ${users[1].id} WHERE id = 2`);
    console.log('✅ Fixed comments foreign keys');

    // Fix email_user
    await sequelize.query(`UPDATE email_user SET user_id = ${users[0].id} WHERE id = 1`);
    console.log('✅ Fixed email_user foreign keys');

    // Fix group_privilege
    await sequelize.query(`UPDATE group_privilege SET privilege_id = 1, role_id = 1 WHERE id = 1`);
    console.log('✅ Fixed group_privilege foreign keys');

    // Fix project_allocation
    await sequelize.query(`UPDATE project_allocation SET project_id = ${projects[0].id}, user_id = ${users[0].id}, role_id = 1 WHERE id = 1`);
    console.log('✅ Fixed project_allocation foreign keys');

    // Fix project_allocation_history
    await sequelize.query(`UPDATE project_allocation_history SET project_id = ${projects[0].id}, user_id = ${users[1].id}, role_id = 2 WHERE id = 1`);
    console.log('✅ Fixed project_allocation_history foreign keys');

    // Fix project_user_privilege
    await sequelize.query(`UPDATE project_user_privilege SET privilege_id = 1, project_id = ${projects[0].id}, user_id = ${users[0].id} WHERE id = 1`);
    console.log('✅ Fixed project_user_privilege foreign keys');

    // Fix user_privilege
    await sequelize.query(`UPDATE user_privilege SET user_Id = ${users[0].id}, project_id = ${projects[0].id}, privilege_id = 1 WHERE id = 1`);
    console.log('✅ Fixed user_privilege foreign keys');

    // Fix allocate_module
    await sequelize.query(`UPDATE allocate_module SET user_id = ${users[0].id}, project_id = ${projects[0].id} WHERE id = 1`);
    await sequelize.query(`UPDATE allocate_module SET user_id = ${users[1].id}, project_id = ${projects[0].id} WHERE id = 2`);
    await sequelize.query(`UPDATE allocate_module SET user_id = ${users[2].id}, project_id = ${projects[1].id} WHERE id = 3`);
    console.log('✅ Fixed allocate_module foreign keys');

    // Fix bench
    await sequelize.query(`UPDATE bench SET user_id = ${users[0].id} WHERE id = 1`);
    await sequelize.query(`UPDATE bench SET user_id = ${users[1].id} WHERE id = 2`);
    console.log('✅ Fixed bench foreign keys');

    // Fix modules
    await sequelize.query(`UPDATE modules SET project_id = ${projects[0].id} WHERE id IN (1, 2)`);
    await sequelize.query(`UPDATE modules SET project_id = ${projects[1].id} WHERE id IN (3, 4, 5)`);
    console.log('✅ Fixed modules foreign keys');

    // Fix release_test_case
    await sequelize.query(`UPDATE release_test_case SET release_id = 1, test_case_id = 1, user_id = ${users[0].id} WHERE id = 1`);
    console.log('✅ Fixed release_test_case foreign keys');

    // Fix releases
    await sequelize.query(`UPDATE releases SET release_type_id = 1 WHERE id = 1`);
    console.log('✅ Fixed releases foreign keys');

    // Fix projects
    await sequelize.query(`UPDATE project SET user_Id = ${users[0].id} WHERE id = ${projects[0].id}`);
    await sequelize.query(`UPDATE project SET user_Id = ${users[1].id} WHERE id = ${projects[1].id}`);
    console.log('✅ Fixed project foreign keys');

    console.log('\n🎉 All foreign key relationships have been fixed!');

    // Final verification
    console.log('\n📊 Final verification:');
    const [defectCount] = await sequelize.query('SELECT COUNT(*) as count FROM defect');
    console.log(`Defects: ${defectCount[0].count} records`);
    
    const [commentCheck] = await sequelize.query('SELECT id, defect_id, user_id FROM comments LIMIT 2');
    console.log('Comments with FKs:', commentCheck);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addDefectsAndFixForeignKeys();
