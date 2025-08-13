const sequelize = require('./db');

async function simpleCheck() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const [projects] = await sequelize.query('SELECT COUNT(*) as count FROM project');
    const [defects] = await sequelize.query('SELECT COUNT(*) as count FROM defect');
    const [history] = await sequelize.query('SELECT COUNT(*) as count FROM defect_history');

    console.log(`Projects: ${projects[0].count}`);
    console.log(`Defects: ${defects[0].count}`);
    console.log(`Defect History: ${history[0].count}`);

    // Show projects
    const [projectList] = await sequelize.query('SELECT project_id, project_name FROM project');
    console.log('\nProjects:');
    projectList.forEach(p => console.log(`  ${p.project_id}: ${p.project_name}`));

    // Show defects
    const [defectList] = await sequelize.query('SELECT defect_id, description FROM defect');
    console.log('\nDefects:');
    defectList.forEach(d => console.log(`  ${d.defect_id}: ${d.description.substring(0, 40)}...`));

    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

simpleCheck();
