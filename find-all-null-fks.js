const sequelize = require('./db');

async function findAllNullForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔍 Checking for NULL foreign keys in all tables:\n');

    // Check allocate_module
    console.log('📊 ALLOCATE_MODULE:');
    const [allocateModule] = await sequelize.query('SELECT id, user_id, modules_id, sub_module_id, project_id FROM allocate_module');
    allocateModule.forEach(a => {
      console.log(`  ID: ${a.id}, user_id: ${a.user_id}, modules_id: ${a.modules_id}, sub_module_id: ${a.sub_module_id}, project_id: ${a.project_id}`);
    });

    // Check bench
    console.log('\n📊 BENCH:');
    const [bench] = await sequelize.query('SELECT id, bench_id, user_id FROM bench');
    bench.forEach(b => {
      console.log(`  ID: ${b.id}, bench_id: ${b.bench_id}, user_id: ${b.user_id}`);
    });

    // Check email_user
    console.log('\n📊 EMAIL_USER:');
    const [emailUser] = await sequelize.query('SELECT id, user_id FROM email_user');
    emailUser.forEach(e => {
      console.log(`  ID: ${e.id}, user_id: ${e.user_id}`);
    });

    // Check group_privilege
    console.log('\n📊 GROUP_PRIVILEGE:');
    const [groupPrivilege] = await sequelize.query('SELECT id, privilege_id, role_id FROM group_privilege');
    groupPrivilege.forEach(g => {
      console.log(`  ID: ${g.id}, privilege_id: ${g.privilege_id}, role_id: ${g.role_id}`);
    });

    // Check project_allocation
    console.log('\n📊 PROJECT_ALLOCATION:');
    const [projectAllocation] = await sequelize.query('SELECT id, project_id, user_id, role_id FROM project_allocation');
    projectAllocation.forEach(p => {
      console.log(`  ID: ${p.id}, project_id: ${p.project_id}, user_id: ${p.user_id}, role_id: ${p.role_id}`);
    });

    // Check project_allocation_history
    console.log('\n📊 PROJECT_ALLOCATION_HISTORY:');
    const [projectAllocationHistory] = await sequelize.query('SELECT id, project_id, user_id, role_id FROM project_allocation_history');
    projectAllocationHistory.forEach(p => {
      console.log(`  ID: ${p.id}, project_id: ${p.project_id}, user_id: ${p.user_id}, role_id: ${p.role_id}`);
    });

    // Check project_user_privilege
    console.log('\n📊 PROJECT_USER_PRIVILEGE:');
    const [projectUserPrivilege] = await sequelize.query('SELECT id, privilege_id, project_id, user_id FROM project_user_privilege');
    projectUserPrivilege.forEach(p => {
      console.log(`  ID: ${p.id}, privilege_id: ${p.privilege_id}, project_id: ${p.project_id}, user_id: ${p.user_id}`);
    });

    // Check user_privilege
    console.log('\n📊 USER_PRIVILEGE:');
    const [userPrivilege] = await sequelize.query('SELECT id, user_Id, project_id, privilege_id FROM user_privilege');
    userPrivilege.forEach(u => {
      console.log(`  ID: ${u.id}, user_Id: ${u.user_Id}, project_id: ${u.project_id}, privilege_id: ${u.privilege_id}`);
    });

    // Check release_test_case
    console.log('\n📊 RELEASE_TEST_CASE:');
    const [releaseTestCase] = await sequelize.query('SELECT id, release_id, test_case_id, user_id FROM release_test_case');
    releaseTestCase.forEach(r => {
      console.log(`  ID: ${r.id}, release_id: ${r.release_id}, test_case_id: ${r.test_case_id}, user_id: ${r.user_id}`);
    });

    // Check releases
    console.log('\n📊 RELEASES:');
    const [releases] = await sequelize.query('SELECT id, release_type_id FROM releases');
    releases.forEach(r => {
      console.log(`  ID: ${r.id}, release_type_id: ${r.release_type_id}`);
    });

    // Show available IDs for reference
    console.log('\n📋 AVAILABLE IDs FOR REFERENCE:');
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [roles] = await sequelize.query('SELECT id, role_name FROM role LIMIT 5');
    const [privileges] = await sequelize.query('SELECT id, privilege_name FROM privilege LIMIT 5');
    
    console.log('Users:', users.map(u => `${u.id}(${u.user_id})`));
    console.log('Projects:', projects.map(p => `${p.id}(${p.project_id})`));
    console.log('Roles:', roles.map(r => `${r.id}(${r.role_name})`));
    console.log('Privileges:', privileges.map(p => `${p.id}(${p.privilege_name})`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

findAllNullForeignKeys();
