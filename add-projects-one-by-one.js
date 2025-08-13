const sequelize = require('./db');

async function addProjectsOneByOne() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current project count
    const [currentProjects] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    console.log(`Current project count: ${currentProjects[0].count}`);

    // Get available user IDs
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    console.log('Available users:', users.map(u => `${u.id}(${u.user_id})`));

    // Add projects one by one
    console.log('\n🏗️ Adding projects one by one...');

    const projects = [
      {
        project_id: 'PROJ003',
        project_name: 'Customer Support Portal',
        client_name: 'ServiceTech Solutions',
        description: 'Web-based customer support system',
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
        description: 'Real-time financial analytics platform',
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
        description: 'Hospital management system',
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
        description: 'RESTful API for inventory management',
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
        description: 'Online learning platform',
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

    for (const project of projects) {
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
        console.log(`✅ Added: ${project.project_id} - ${project.project_name}`);
      } catch (error) {
        console.log(`❌ Error adding ${project.project_id}: ${error.message}`);
      }
    }

    // Check final count
    const [finalProjects] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    console.log(`\nFinal project count: ${finalProjects[0].count}`);

    // Show all projects
    const [allProjects] = await sequelize.query('SELECT project_id, project_name, client_name FROM project ORDER BY id');
    console.log('\n📋 All projects:');
    allProjects.forEach(p => {
      console.log(`  ${p.project_id}: ${p.project_name} (${p.client_name})`);
    });

    console.log('\n🎉 Projects addition completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addProjectsOneByOne();
