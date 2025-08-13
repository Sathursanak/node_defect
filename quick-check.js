const sequelize = require('./db');

(async () => {
  try {
    await sequelize.authenticate();
    const [projects] = await sequelize.query('SELECT id, project_id FROM project');
    console.log('Projects:', projects);
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
    await sequelize.close();
  }
})();
