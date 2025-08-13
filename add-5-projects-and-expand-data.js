const sequelize = require('./db');

async function add5ProjectsAndExpandData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current project count
    console.log('📊 Current projects in table:');
    const [currentProjects] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    console.log(`Current project count: ${currentProjects[0].count}`);

    // Get available user IDs
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    console.log('Available users:', users.map(u => `${u.id}(${u.user_id})`));

    // Add 5 new projects
    console.log('\n🏗️ Adding 5 new projects...');

    const projectsToAdd = [
      {
        project_id: 'PROJ003',
        project_name: 'Customer Support Portal',
        client_name: 'ServiceTech Solutions',
        description: 'Web-based customer support and ticketing system',
        email: 'contact@servicetech.com',
        phone_no: '5551234567',
        country: 'USA',
        state: 'Texas',
        start_date: '2024-02-15',
        end_date: '2024-10-30',
        kloc: 35.2,
        project_status: 'ACTIVE',
        user_Id: users[2].id
      },
      {
        project_id: 'PROJ004',
        project_name: 'Financial Analytics Dashboard',
        client_name: 'FinanceCore Bank',
        description: 'Real-time financial data analytics and reporting platform',
        email: 'tech@financecore.com',
        phone_no: '5559876543',
        country: 'USA',
        state: 'New York',
        start_date: '2024-03-01',
        end_date: '2024-12-15',
        kloc: 42.8,
        project_status: 'ACTIVE',
        user_Id: users[0].id
      },
      {
        project_id: 'PROJ005',
        project_name: 'Healthcare Management System',
        client_name: 'MedCare Hospital Group',
        description: 'Comprehensive hospital and patient management system',
        email: 'it@medcare.org',
        phone_no: '5555678901',
        country: 'USA',
        state: 'California',
        start_date: '2024-01-10',
        end_date: '2024-11-20',
        kloc: 58.5,
        project_status: 'ACTIVE',
        user_Id: users[1].id
      },
      {
        project_id: 'PROJ006',
        project_name: 'Inventory Management API',
        client_name: 'LogiFlow Enterprises',
        description: 'RESTful API for warehouse and inventory management',
        email: 'dev@logiflow.com',
        phone_no: '5552345678',
        country: 'Canada',
        state: 'Ontario',
        start_date: '2024-04-01',
        end_date: '2024-09-30',
        kloc: 28.3,
        project_status: 'PLANNING',
        user_Id: users[2].id
      },
      {
        project_id: 'PROJ007',
        project_name: 'Educational Learning Platform',
        client_name: 'EduTech Academy',
        description: 'Online learning platform with video streaming and assessments',
        email: 'support@edutech.edu',
        phone_no: '5557890123',
        country: 'USA',
        state: 'Florida',
        start_date: '2024-05-15',
        end_date: '2025-02-28',
        kloc: 67.9,
        project_status: 'PLANNING',
        user_Id: users[0].id
      }
    ];

    // Insert projects
    for (const project of projectsToAdd) {
      try {
        await sequelize.query(`
          INSERT INTO project (
            project_id, project_name, client_name, description, email, phone_no,
            country, state, start_date, end_date, kloc, project_status, user_Id
          ) VALUES (
            '${project.project_id}', '${project.project_name}', '${project.client_name}',
            '${project.description}', '${project.email}', '${project.phone_no}',
            '${project.country}', '${project.state}', '${project.start_date}',
            '${project.end_date}', ${project.kloc}, '${project.project_status}', ${project.user_Id}
          )
        `);
        console.log(`✅ Added project: ${project.project_id} - ${project.project_name}`);
      } catch (error) {
        console.log(`❌ Error adding project ${project.project_id}: ${error.message}`);
      }
    }

    // Get updated project list
    const [allProjects] = await sequelize.query('SELECT id, project_id, project_name FROM project');
    console.log('\n📋 All projects now:');
    allProjects.forEach(p => {
      console.log(`  ${p.id}: ${p.project_id} - ${p.project_name}`);
    });

    // Add more modules for new projects
    console.log('\n📦 Adding modules for new projects...');
    const modulesToAdd = [
      { module_id: 'MOD006', module_name: 'Ticket Management', project_id: allProjects[2].id },
      { module_id: 'MOD007', module_name: 'Knowledge Base', project_id: allProjects[2].id },
      { module_id: 'MOD008', module_name: 'Data Visualization', project_id: allProjects[3].id },
      { module_id: 'MOD009', module_name: 'Report Generation', project_id: allProjects[3].id },
      { module_id: 'MOD010', module_name: 'Patient Records', project_id: allProjects[4].id },
      { module_id: 'MOD011', module_name: 'Appointment Scheduling', project_id: allProjects[4].id },
      { module_id: 'MOD012', module_name: 'Inventory Tracking', project_id: allProjects[5].id },
      { module_id: 'MOD013', module_name: 'Course Management', project_id: allProjects[6].id },
      { module_id: 'MOD014', module_name: 'Video Streaming', project_id: allProjects[6].id }
    ];

    for (const module of modulesToAdd) {
      try {
        await sequelize.query(`
          INSERT INTO modules (module_id, module_name, project_id) 
          VALUES ('${module.module_id}', '${module.module_name}', ${module.project_id})
        `);
        console.log(`✅ Added module: ${module.module_id} - ${module.module_name}`);
      } catch (error) {
        console.log(`❌ Error adding module ${module.module_id}: ${error.message}`);
      }
    }

    // Add more users
    console.log('\n👥 Adding more users...');
    const usersToAdd = [
      {
        user_id: 'USR004',
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@company.com',
        password: 'hashedpassword101',
        phone_no: '4444444444',
        user_gender: 'Female',
        user_status: 'Active',
        join_date: '2024-02-10',
        designation_id: 4 // QA Engineer
      },
      {
        user_id: 'USR005',
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob.wilson@company.com',
        password: 'hashedpassword202',
        phone_no: '6666666666',
        user_gender: 'Male',
        user_status: 'Active',
        join_date: '2024-02-20',
        designation_id: 5 // Business Analyst
      },
      {
        user_id: 'USR006',
        first_name: 'Carol',
        last_name: 'Davis',
        email: 'carol.davis@company.com',
        password: 'hashedpassword303',
        phone_no: '7777777777',
        user_gender: 'Female',
        user_status: 'Active',
        join_date: '2024-03-01',
        designation_id: 6 // DevOps Engineer
      }
    ];

    for (const user of usersToAdd) {
      try {
        await sequelize.query(`
          INSERT INTO user (
            user_id, first_name, last_name, email, password, phone_no,
            user_gender, user_status, join_date, designation_id
          ) VALUES (
            '${user.user_id}', '${user.first_name}', '${user.last_name}',
            '${user.email}', '${user.password}', '${user.phone_no}',
            '${user.user_gender}', '${user.user_status}', '${user.join_date}', ${user.designation_id}
          )
        `);
        console.log(`✅ Added user: ${user.user_id} - ${user.first_name} ${user.last_name}`);
      } catch (error) {
        console.log(`❌ Error adding user ${user.user_id}: ${error.message}`);
      }
    }

    console.log('\n🎉 Phase 1 completed! Added 5 projects, 9 modules, and 3 users.');
    console.log('📊 Current counts:');
    
    const [projectCount] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    const [moduleCount] = await sequelize.query('SELECT COUNT(*) as count FROM modules');
    const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM user');
    
    console.log(`  Projects: ${projectCount[0].count}`);
    console.log(`  Modules: ${moduleCount[0].count}`);
    console.log(`  Users: ${userCount[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

add5ProjectsAndExpandData();
