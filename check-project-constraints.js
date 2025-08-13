const sequelize = require('./db');

async function checkProjectConstraints() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check project table structure
    console.log('📊 Project table structure:');
    const [columns] = await sequelize.query('DESCRIBE project');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    // Check current projects
    console.log('\n📋 Current projects:');
    const [projects] = await sequelize.query('SELECT id, project_id, project_name, project_status FROM project');
    projects.forEach(p => {
      console.log(`  ID: ${p.id}, ${p.project_id}: ${p.project_name} (Status: ${p.project_status})`);
    });

    // Add remaining projects with correct status values
    console.log('\n🏗️ Adding remaining projects with correct status...');

    const remainingProjects = [
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
        project_status: 'ACTIVE', // Changed from PLANNING
        user_Id: 3
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
        project_status: 'ACTIVE', // Changed from PLANNING
        user_Id: 1
      }
    ];

    for (const project of remainingProjects) {
      try {
        // Check if project already exists
        const [existing] = await sequelize.query(`SELECT COUNT(*) as count FROM project WHERE project_id = '${project.project_id}'`);
        
        if (existing[0].count === 0) {
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
        } else {
          console.log(`⚠️ Project ${project.project_id} already exists`);
        }
      } catch (error) {
        console.log(`❌ Error adding ${project.project_id}: ${error.message}`);
      }
    }

    // Final count
    const [finalCount] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    console.log(`\nFinal project count: ${finalCount[0].count}`);

    // Show all projects
    const [allProjects] = await sequelize.query('SELECT project_id, project_name, client_name, project_status FROM project ORDER BY id');
    console.log('\n📋 All projects:');
    allProjects.forEach(p => {
      console.log(`  ${p.project_id}: ${p.project_name} (${p.client_name}) - ${p.project_status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkProjectConstraints();
