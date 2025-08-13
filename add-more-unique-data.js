const sequelize = require('./db');

async function addMoreUniqueData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check existing data first
    console.log('📊 Checking existing data...');
    
    const [users] = await sequelize.query('SELECT user_id, email FROM user');
    console.log('Existing users:', users.map(u => u.user_id));
    
    const [projects] = await sequelize.query('SELECT project_id, email FROM project');
    console.log('Existing projects:', projects.map(p => p.project_id));

    // Add more defects (since those worked)
    console.log('\n📝 Adding more defects...');
    
    try {
      await sequelize.query(`
        INSERT INTO defect (defect_id, description, steps, attachment, re_open_count, assigned_by, assigned_to, defect_type_id, defect_status_id, modules_id, priority_id, project_id, severity_id, sub_module_id) 
        VALUES 
        ('DEF003', 'Project creation form validation error', '1. Go to create project 2. Leave required fields empty 3. Submit', NULL, 1, 1, 1, 11, 15, 8, 1, 1, 3, 9),
        ('DEF004', 'Report generation performance issue', '1. Navigate to reports 2. Select large date range 3. Generate report', NULL, 0, 1, 1, 12, 16, 10, 4, 1, 1, 10),
        ('DEF005', 'UI alignment issue on mobile', '1. Open app on mobile 2. Navigate to dashboard 3. Check layout', NULL, 0, 1, 1, 13, 15, 6, 2, 1, 2, 6)
      `);
      console.log('✅ Added 3 more defects');
    } catch (error) {
      console.log('❌ Error adding defects:', error.message);
    }

    // Add more test cases
    console.log('\n📝 Adding more test cases...');
    try {
      await sequelize.query(`
        INSERT INTO test_case (test_case_id, description, steps, defect_type_id, modules_id, project_id, severity_id, sub_module_id) 
        VALUES 
        ('TC002', 'User registration validation', 'Test all form validations for user registration', 11, 6, 1, 2, 6),
        ('TC003', 'Project dashboard loading', 'Verify project dashboard loads correctly', 12, 8, 1, 3, 9),
        ('TC004', 'Password strength validation', 'Test password complexity requirements', 14, 7, 1, 2, 7),
        ('TC005', 'Module allocation workflow', 'Test complete module allocation process', 11, 9, 1, 1, 10)
      `);
      console.log('✅ Added 4 more test cases');
    } catch (error) {
      console.log('❌ Error adding test cases:', error.message);
    }

    // Add more comments
    console.log('\n📝 Adding more comments...');
    try {
      await sequelize.query(`
        INSERT INTO comments (comment, attachment, defect_id, user_id) 
        VALUES 
        ('This defect needs immediate attention', NULL, 1, 1),
        ('Fixed in latest build, please verify', NULL, 2, 1),
        ('Unable to reproduce this issue', NULL, 1, 1),
        ('Assigned to development team', NULL, 3, 1)
      `);
      console.log('✅ Added 4 more comments');
    } catch (error) {
      console.log('❌ Error adding comments:', error.message);
    }

    // Add more allocate_module entries
    console.log('\n📝 Adding more module allocations...');
    try {
      await sequelize.query(`
        INSERT INTO allocate_module (user_id, modules_id, sub_module_id, project_id) 
        VALUES 
        (1, 7, 7, 1),
        (1, 8, 9, 1),
        (1, 9, 10, 1)
      `);
      console.log('✅ Added 3 more module allocations');
    } catch (error) {
      console.log('❌ Error adding module allocations:', error.message);
    }

    // Add more bench entries
    console.log('\n📝 Adding more bench entries...');
    try {
      await sequelize.query(`
        INSERT INTO bench (bench_id, allocated, availability, user_id) 
        VALUES 
        ('BENCH003', 1, 0, 1),
        ('BENCH004', 0, 1, 1),
        ('BENCH005', 1, 0, 1)
      `);
      console.log('✅ Added 3 more bench entries');
    } catch (error) {
      console.log('❌ Error adding bench entries:', error.message);
    }

    // Final verification
    console.log('\n📊 Final data counts:');
    const tables = ['user', 'project', 'defect', 'test_case', 'comments', 'allocate_module', 'bench'];
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

addMoreUniqueData();
