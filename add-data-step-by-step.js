const sequelize = require('./db');

async function addDataStepByStep() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Step 1: Add one user at a time to identify issues
    console.log('📝 Adding users one by one...');
    
    try {
      await sequelize.query(`
        INSERT INTO user (user_id, first_name, last_name, email, password, phone_no, user_gender, user_status, join_date, designation_id) 
        VALUES ('USR002', 'Jane', 'Smith', 'jane.smith@company.com', 'hashedpass456', '0987654321', 'Female', 'Active', '2024-02-01', 2)
      `);
      console.log('✅ Added user USR002');
    } catch (error) {
      console.log('❌ Error adding USR002:', error.message);
    }

    try {
      await sequelize.query(`
        INSERT INTO user (user_id, first_name, last_name, email, password, phone_no, user_gender, user_status, join_date, designation_id) 
        VALUES ('USR003', 'Mike', 'Johnson', 'mike.johnson@company.com', 'hashedpass789', '5555555555', 'Male', 'Active', '2024-01-20', 3)
      `);
      console.log('✅ Added user USR003');
    } catch (error) {
      console.log('❌ Error adding USR003:', error.message);
    }

    // Step 2: Add defects with existing user IDs
    console.log('\n📝 Adding defects...');
    
    try {
      await sequelize.query(`
        INSERT INTO defect (defect_id, description, steps, attachment, re_open_count, assigned_by, assigned_to, defect_type_id, defect_status_id, modules_id, priority_id, project_id, severity_id, sub_module_id) 
        VALUES ('DEF001', 'Login button not working', '1. Go to login page 2. Enter credentials 3. Click login button', NULL, 0, 1, 1, 11, 15, 6, 3, 1, 1, 6)
      `);
      console.log('✅ Added defect DEF001');
    } catch (error) {
      console.log('❌ Error adding DEF001:', error.message);
    }

    try {
      await sequelize.query(`
        INSERT INTO defect (defect_id, description, steps, attachment, re_open_count, assigned_by, assigned_to, defect_type_id, defect_status_id, modules_id, priority_id, project_id, severity_id, sub_module_id) 
        VALUES ('DEF002', 'Password reset email not sent', '1. Click forgot password 2. Enter email 3. Submit form', NULL, 0, 1, 1, 11, 16, 7, 2, 1, 2, 7)
      `);
      console.log('✅ Added defect DEF002');
    } catch (error) {
      console.log('❌ Error adding DEF002:', error.message);
    }

    // Step 3: Update existing user designation
    console.log('\n📝 Updating user designation...');
    try {
      await sequelize.query(`UPDATE user SET designation_id = 1 WHERE id = 1`);
      console.log('✅ Updated user designation');
    } catch (error) {
      console.log('❌ Error updating user designation:', error.message);
    }

    // Step 4: Add more projects
    console.log('\n📝 Adding more projects...');
    try {
      await sequelize.query(`
        INSERT INTO project (project_id, project_name, client_name, description, email, phone_no, country, state, start_date, end_date, kloc, project_status, user_Id) 
        VALUES ('PROJ002', 'Mobile App Development', 'TechStart LLC', 'iOS and Android mobile application', 'contact@techstart.com', '3333333333', 'USA', 'NY', '2024-03-01', '2024-11-30', 25.5, 'ACTIVE', 1)
      `);
      console.log('✅ Added project PROJ002');
    } catch (error) {
      console.log('❌ Error adding PROJ002:', error.message);
    }

    // Final verification
    console.log('\n📊 Current data counts:');
    const tables = ['user', 'project', 'defect'];
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

addDataStepByStep();
