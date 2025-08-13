const sequelize = require('./db');

async function checkForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check tables with foreign key issues
    console.log('🔍 Checking foreign key columns that are NULL:\n');

    // Check comments table
    console.log('📊 COMMENTS TABLE:');
    const [comments] = await sequelize.query('SELECT id, comment, defect_id, user_id FROM comments');
    comments.forEach(c => {
      console.log(`  ID: ${c.id}, Comment: "${c.comment.substring(0, 30)}...", defect_id: ${c.defect_id}, user_id: ${c.user_id}`);
    });

    // Check email_user table
    console.log('\n📊 EMAIL_USER TABLE:');
    const [emailUsers] = await sequelize.query('SELECT id, user_id, defect_email_status FROM email_user');
    emailUsers.forEach(e => {
      console.log(`  ID: ${e.id}, user_id: ${e.user_id}, defect_email_status: ${e.defect_email_status}`);
    });

    // Check group_privilege table
    console.log('\n📊 GROUP_PRIVILEGE TABLE:');
    const [groupPrivs] = await sequelize.query('SELECT id, privilege_id, role_id FROM group_privilege');
    groupPrivs.forEach(g => {
      console.log(`  ID: ${g.id}, privilege_id: ${g.privilege_id}, role_id: ${g.role_id}`);
    });

    // Check project_allocation table
    console.log('\n📊 PROJECT_ALLOCATION TABLE:');
    const [projAllocs] = await sequelize.query('SELECT id, project_id, user_id, role_id, allocation_percentage FROM project_allocation');
    projAllocs.forEach(p => {
      console.log(`  ID: ${p.id}, project_id: ${p.project_id}, user_id: ${p.user_id}, role_id: ${p.role_id}, allocation: ${p.allocation_percentage}%`);
    });

    // Check user table designations
    console.log('\n📊 USER TABLE (designation_id):');
    const [users] = await sequelize.query('SELECT id, user_id, first_name, designation_id FROM user');
    users.forEach(u => {
      console.log(`  ID: ${u.id}, user_id: ${u.user_id}, name: ${u.first_name}, designation_id: ${u.designation_id}`);
    });

    // Check modules table project references
    console.log('\n📊 MODULES TABLE (project_id):');
    const [modules] = await sequelize.query('SELECT id, module_id, module_name, project_id FROM modules');
    modules.forEach(m => {
      console.log(`  ID: ${m.id}, module_id: ${m.module_id}, name: ${m.module_name}, project_id: ${m.project_id}`);
    });

    // Check test_case table
    console.log('\n📊 TEST_CASE TABLE:');
    const [testCases] = await sequelize.query('SELECT id, test_case_id, defect_type_id, modules_id, project_id, severity_id, sub_module_id FROM test_case');
    testCases.forEach(t => {
      console.log(`  ID: ${t.id}, test_case_id: ${t.test_case_id}, defect_type_id: ${t.defect_type_id}, modules_id: ${t.modules_id}, project_id: ${t.project_id}`);
    });

    // Check available IDs for reference
    console.log('\n📋 AVAILABLE IDs FOR REFERENCE:');
    
    const [defectIds] = await sequelize.query('SELECT id, defect_id FROM defect');
    console.log('Defect IDs:', defectIds.map(d => `${d.id}(${d.defect_id})`));
    
    const [userIds] = await sequelize.query('SELECT id, user_id FROM user');
    console.log('User IDs:', userIds.map(u => `${u.id}(${u.user_id})`));
    
    const [projectIds] = await sequelize.query('SELECT id, project_id FROM project');
    console.log('Project IDs:', projectIds.map(p => `${p.id}(${p.project_id})`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkForeignKeys();
