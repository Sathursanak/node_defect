const sequelize = require('./db');

async function addComprehensiveData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🚀 ADDING COMPREHENSIVE DATA - NO NULL VALUES\n');

    // 1. Add more projects (need 5 total, have 2, add 3 more)
    console.log('🏗️ Adding 3 more projects...');
    const [currentUsers] = await sequelize.query('SELECT id, user_id FROM user');
    
    const newProjects = [
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
        user_Id: currentUsers[0].id
      },
      {
        project_id: 'PROJ004',
        project_name: 'Financial Analytics Dashboard',
        client_name: 'FinanceCore Bank',
        description: 'Real-time financial data analytics platform',
        email: 'tech@financecore.com',
        phone_no: '5559876543',
        country: 'USA',
        state: 'New York',
        start_date: '2024-03-01',
        end_date: '2024-12-15',
        kloc: 42.8,
        project_status: 'ACTIVE',
        user_Id: currentUsers[1].id
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
        user_Id: currentUsers[2].id
      }
    ];

    for (const project of newProjects) {
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

    // 2. Add more modules for new projects
    console.log('\n📦 Adding modules for new projects...');
    const [allProjects] = await sequelize.query('SELECT id, project_id FROM project ORDER BY id');
    
    const newModules = [
      { module_id: 'MOD006', module_name: 'Ticket Management', project_id: allProjects[2].id },
      { module_id: 'MOD007', module_name: 'Knowledge Base', project_id: allProjects[2].id },
      { module_id: 'MOD008', module_name: 'Data Visualization', project_id: allProjects[3].id },
      { module_id: 'MOD009', module_name: 'Report Generation', project_id: allProjects[3].id },
      { module_id: 'MOD010', module_name: 'Patient Records', project_id: allProjects[4].id },
      { module_id: 'MOD011', module_name: 'Appointment Scheduling', project_id: allProjects[4].id }
    ];

    for (const module of newModules) {
      try {
        await sequelize.query(`
          INSERT INTO modules (module_id, module_name, project_id, createdAt, updatedAt) 
          VALUES ('${module.module_id}', '${module.module_name}', ${module.project_id}, NOW(), NOW())
        `);
        console.log(`✅ Added module: ${module.module_id} - ${module.module_name}`);
      } catch (error) {
        console.log(`❌ Error adding module ${module.module_id}: ${error.message}`);
      }
    }

    // 3. Add more sub-modules
    console.log('\n📋 Adding more sub-modules...');
    const [allModules] = await sequelize.query('SELECT id, module_id FROM modules ORDER BY id');
    
    const newSubModules = [
      { sub_module_id: 'SUB006', sub_module_name: 'Ticket Creation', modules_id: allModules[5].id },
      { sub_module_id: 'SUB007', sub_module_name: 'Article Management', modules_id: allModules[6].id },
      { sub_module_id: 'SUB008', sub_module_name: 'Chart Generation', modules_id: allModules[7].id },
      { sub_module_id: 'SUB009', sub_module_name: 'Patient Registration', modules_id: allModules[9].id },
      { sub_module_id: 'SUB010', sub_module_name: 'Appointment Booking', modules_id: allModules[10].id }
    ];

    for (const subModule of newSubModules) {
      try {
        await sequelize.query(`
          INSERT INTO sub_module (sub_module_id, sub_module_name, modules_id) 
          VALUES ('${subModule.sub_module_id}', '${subModule.sub_module_name}', ${subModule.modules_id})
        `);
        console.log(`✅ Added sub-module: ${subModule.sub_module_id} - ${subModule.sub_module_name}`);
      } catch (error) {
        console.log(`❌ Error adding sub-module ${subModule.sub_module_id}: ${error.message}`);
      }
    }

    // 4. Add 7 more defects (to have 10 total)
    console.log('\n🐛 Adding 7 more defects (for 10 total)...');
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    const [modules] = await sequelize.query('SELECT id, module_id FROM modules');
    const [subModules] = await sequelize.query('SELECT id, sub_module_id FROM sub_module');
    const [releaseTestCases] = await sequelize.query('SELECT id, release_test_case_id FROM release_test_case');

    const newDefects = [
      {
        defect_id: 'DEF004',
        description: 'User profile image upload fails with large files',
        steps: '1. Go to profile page 2. Upload image >5MB 3. Click save',
        assigned_by: users[0].id,
        assigned_to: users[1].id,
        project_id: projects[0].id,
        modules_id: modules[0].id,
        sub_module_id: subModules[0].id,
        release_test_case_id: releaseTestCases[0].id
      },
      {
        defect_id: 'DEF005',
        description: 'Dashboard loading time exceeds 10 seconds',
        steps: '1. Login to application 2. Navigate to dashboard 3. Observe loading time',
        assigned_by: users[1].id,
        assigned_to: users[2].id,
        project_id: projects[1].id,
        modules_id: modules[1].id,
        sub_module_id: subModules[1].id,
        release_test_case_id: releaseTestCases[0].id
      },
      {
        defect_id: 'DEF006',
        description: 'Email notification not sent for new assignments',
        steps: '1. Assign task to user 2. Check email notifications 3. Verify delivery',
        assigned_by: users[2].id,
        assigned_to: users[0].id,
        project_id: projects[2].id,
        modules_id: modules[5].id,
        sub_module_id: subModules[5].id,
        release_test_case_id: releaseTestCases[0].id
      },
      {
        defect_id: 'DEF007',
        description: 'Search functionality returns incorrect results',
        steps: '1. Enter search term 2. Click search 3. Verify results accuracy',
        assigned_by: users[0].id,
        assigned_to: users[2].id,
        project_id: projects[3].id,
        modules_id: modules[7].id,
        sub_module_id: subModules[7].id,
        release_test_case_id: releaseTestCases[0].id
      },
      {
        defect_id: 'DEF008',
        description: 'Data export feature generates corrupted files',
        steps: '1. Go to reports section 2. Select data export 3. Download file',
        assigned_by: users[1].id,
        assigned_to: users[0].id,
        project_id: projects[3].id,
        modules_id: modules[8].id,
        sub_module_id: subModules[7].id,
        release_test_case_id: releaseTestCases[0].id
      },
      {
        defect_id: 'DEF009',
        description: 'Session timeout occurs too frequently',
        steps: '1. Login to application 2. Stay idle for 15 minutes 3. Try to perform action',
        assigned_by: users[2].id,
        assigned_to: users[1].id,
        project_id: projects[4].id,
        modules_id: modules[9].id,
        sub_module_id: subModules[8].id,
        release_test_case_id: releaseTestCases[0].id
      },
      {
        defect_id: 'DEF010',
        description: 'UI elements overlap on smaller screen resolutions',
        steps: '1. Set browser to 1024x768 2. Navigate to main page 3. Check element positioning',
        assigned_by: users[0].id,
        assigned_to: users[1].id,
        project_id: projects[4].id,
        modules_id: modules[10].id,
        sub_module_id: subModules[9].id,
        release_test_case_id: releaseTestCases[0].id
      }
    ];

    for (const defect of newDefects) {
      try {
        await sequelize.query(`
          INSERT INTO defect (
            defect_id, description, steps, attachment, re_open_count,
            assigned_by, assigned_to, defect_type_id, defect_status_id,
            modules_id, priority_id, project_id, severity_id, sub_module_id,
            release_test_case_id
          ) VALUES (
            '${defect.defect_id}', '${defect.description}', '${defect.steps}', 'No attachment', 0,
            ${defect.assigned_by}, ${defect.assigned_to}, 1, 1,
            ${defect.modules_id}, 1, ${defect.project_id}, 2, ${defect.sub_module_id},
            ${defect.release_test_case_id}
          )
        `);
        console.log(`✅ Added defect: ${defect.defect_id}`);
      } catch (error) {
        console.log(`❌ Error adding defect ${defect.defect_id}: ${error.message}`);
      }
    }

    console.log('\n📊 Current status check...');
    const [projectCount] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    const [defectCount] = await sequelize.query('SELECT COUNT(*) as count FROM defect');
    console.log(`Projects: ${projectCount[0].count}, Defects: ${defectCount[0].count}`);

    console.log('\n🎉 Phase 1 completed! Now adding defect history...');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addComprehensiveData();
