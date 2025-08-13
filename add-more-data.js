const sequelize = require('./db');

async function addMoreData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // 1. Add more users with proper designation references
    console.log('📝 Adding more users...');
    await sequelize.query(`
      INSERT INTO user (user_id, first_name, last_name, email, password, phone_no, user_gender, user_status, join_date, designation_id) VALUES
      ('USR002', 'Jane', 'Smith', 'jane.smith@company.com', 'hashedpass456', '0987654321', 'Female', 'Active', '2024-02-01', 2),
      ('USR003', 'Mike', 'Johnson', 'mike.johnson@company.com', 'hashedpass789', '5555555555', 'Male', 'Active', '2024-01-20', 3),
      ('USR004', 'Sarah', 'Wilson', 'sarah.wilson@company.com', 'hashedpass101', '1111111111', 'Female', 'Active', '2024-03-01', 5),
      ('USR005', 'David', 'Brown', 'david.brown@company.com', 'hashedpass202', '2222222222', 'Male', 'Active', '2024-02-15', 4)
    `);
    console.log('✅ Added 4 more users');

    // 2. Add more projects
    console.log('📝 Adding more projects...');
    await sequelize.query(`
      INSERT INTO project (project_id, project_name, client_name, description, email, phone_no, country, state, start_date, end_date, kloc, project_status, user_Id) VALUES
      ('PROJ002', 'Mobile App Development', 'TechStart LLC', 'iOS and Android mobile application', 'contact@techstart.com', '3333333333', 'USA', 'NY', '2024-03-01', '2024-11-30', 25.5, 'ACTIVE', 2),
      ('PROJ003', 'Web Portal Redesign', 'DesignCorp', 'Complete website redesign project', 'info@designcorp.com', '4444444444', 'USA', 'TX', '2024-02-15', '2024-08-15', 15.0, 'ACTIVE', 3)
    `);
    console.log('✅ Added 2 more projects');

    // 3. Update modules to reference projects
    console.log('📝 Updating modules with project references...');
    await sequelize.query(`
      UPDATE modules SET project_id = 1 WHERE id IN (6, 7);
      UPDATE modules SET project_id = 2 WHERE id IN (8, 9);
      UPDATE modules SET project_id = 3 WHERE id = 10;
    `);
    console.log('✅ Updated modules with project references');

    // 4. Add defects with proper foreign key references
    console.log('📝 Adding defects with proper references...');
    await sequelize.query(`
      INSERT INTO defect (defect_id, description, steps, attachment, re_open_count, assigned_by, assigned_to, defect_type_id, defect_status_id, modules_id, priority_id, project_id, severity_id, sub_module_id) VALUES
      ('DEF001', 'Login button not working', '1. Go to login page 2. Enter credentials 3. Click login button', NULL, 0, 1, 2, 11, 15, 6, 3, 1, 1, 6),
      ('DEF002', 'Password reset email not sent', '1. Click forgot password 2. Enter email 3. Submit form', NULL, 0, 2, 4, 11, 16, 7, 2, 1, 2, 8),
      ('DEF003', 'Project creation form validation error', '1. Go to create project 2. Leave required fields empty 3. Submit', NULL, 1, 3, 5, 11, 15, 8, 1, 2, 3, 9),
      ('DEF004', 'Report generation performance issue', '1. Navigate to reports 2. Select large date range 3. Generate report', NULL, 0, 1, 4, 12, 16, 10, 4, 3, 1, 10)
    `);
    console.log('✅ Added 4 defects with proper references');

    // 5. Update user designations
    console.log('📝 Updating user designations...');
    await sequelize.query(`
      UPDATE user SET designation_id = 1 WHERE id = 1;
    `);
    console.log('✅ Updated user designations');

    // 6. Add more test cases
    console.log('📝 Adding more test cases...');
    await sequelize.query(`
      INSERT INTO test_case (test_case_id, description, steps, defect_type_id, modules_id, project_id, severity_id, sub_module_id) VALUES
      ('TC002', 'User registration validation', 'Test all form validations for user registration', 11, 6, 1, 2, 6),
      ('TC003', 'Project dashboard loading', 'Verify project dashboard loads correctly', 12, 8, 2, 3, 9),
      ('TC004', 'Password strength validation', 'Test password complexity requirements', 14, 7, 1, 2, 8)
    `);
    console.log('✅ Added 3 more test cases');

    // 7. Add more email user settings
    console.log('📝 Adding more email user settings...');
    await sequelize.query(`
      INSERT INTO email_user (defect_email_status, module_allocation_email_status, project_allocation_email_status, submodule_allocation_email_status, user_id) VALUES
      (1, 1, 0, 1, 2),
      (0, 1, 1, 0, 3),
      (1, 0, 1, 1, 4)
    `);
    console.log('✅ Added 3 more email user settings');

    // 8. Add more project allocations
    console.log('📝 Adding more project allocations...');
    await sequelize.query(`
      INSERT INTO project_allocation (allocation_percentage, start_date, end_date, project_id, user_id, role_id) VALUES
      (80, '2024-01-01', '2024-12-31', 1, 2, 4),
      (100, '2024-02-01', '2024-11-30', 2, 3, 3),
      (60, '2024-03-01', '2024-08-15', 3, 4, 5),
      (90, '2024-01-15', '2024-12-31', 1, 5, 2)
    `);
    console.log('✅ Added 4 more project allocations');

    console.log('\n🎉 Successfully added comprehensive data with proper foreign key relationships!');
    
    // Final verification
    console.log('\n📊 Final verification...');
    const tables = ['user', 'project', 'defect', 'test_case', 'email_user', 'project_allocation'];
    for (const table of tables) {
      const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${result[0].count} records`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addMoreData();
