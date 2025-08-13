const sequelize = require('./db');

async function addProjectsSimple() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current project count
    const [currentProjects] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    console.log(`Current project count: ${currentProjects[0].count}`);

    // Get available user IDs
    const [users] = await sequelize.query('SELECT id, user_id FROM user');
    console.log('Available users:', users.map(u => `${u.id}(${u.user_id})`));

    // Add 5 new projects
    console.log('\n🏗️ Adding 5 new projects...');

    await sequelize.query(`
      INSERT INTO project (project_id, project_name, client_name, description, email, phone_no, country, state, start_date, end_date, kloc, project_status, user_Id) VALUES
      ('PROJ003', 'Customer Support Portal', 'ServiceTech Solutions', 'Web-based customer support system', 'contact@servicetech.com', '5551234567', 'USA', 'Texas', '2024-02-15', '2024-10-30', 35.2, 'ACTIVE', ${users[2].id}),
      ('PROJ004', 'Financial Analytics Dashboard', 'FinanceCore Bank', 'Real-time financial analytics platform', 'tech@financecore.com', '5559876543', 'USA', 'New York', '2024-03-01', '2024-12-15', 42.8, 'ACTIVE', ${users[0].id}),
      ('PROJ005', 'Healthcare Management System', 'MedCare Hospital Group', 'Hospital management system', 'it@medcare.org', '5555678901', 'USA', 'California', '2024-01-10', '2024-11-20', 58.5, 'ACTIVE', ${users[1].id}),
      ('PROJ006', 'Inventory Management API', 'LogiFlow Enterprises', 'RESTful API for inventory management', 'dev@logiflow.com', '5552345678', 'Canada', 'Ontario', '2024-04-01', '2024-09-30', 28.3, 'PLANNING', ${users[2].id}),
      ('PROJ007', 'Educational Learning Platform', 'EduTech Academy', 'Online learning platform', 'support@edutech.edu', '5557890123', 'USA', 'Florida', '2024-05-15', '2025-02-28', 67.9, 'PLANNING', ${users[0].id})
    `);
    console.log('✅ Added 5 new projects');

    // Check final count
    const [finalProjects] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    console.log(`\nFinal project count: ${finalProjects[0].count}`);

    // Show all projects
    const [allProjects] = await sequelize.query('SELECT project_id, project_name, client_name FROM project');
    console.log('\n📋 All projects:');
    allProjects.forEach(p => {
      console.log(`  ${p.project_id}: ${p.project_name} (${p.client_name})`);
    });

    console.log('\n🎉 Successfully added 5 projects!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addProjectsSimple();
