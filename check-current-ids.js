const sequelize = require('./db');

async function checkCurrentIds() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check key tables with their actual IDs
    const keyTables = [
      { name: 'user', fields: ['id', 'user_id', 'first_name', 'designation_id'] },
      { name: 'project', fields: ['id', 'project_id', 'project_name'] },
      { name: 'modules', fields: ['id', 'module_id', 'module_name'] },
      { name: 'sub_module', fields: ['id', 'sub_module_id', 'sub_module_name', 'modules_id'] },
      { name: 'designation', fields: ['id', 'designation'] },
      { name: 'role', fields: ['id', 'role_name'] },
      { name: 'priority', fields: ['id', 'priority'] },
      { name: 'severity', fields: ['id', 'severity_name'] },
      { name: 'defect_status', fields: ['id', 'defect_status_name'] },
      { name: 'defect_type', fields: ['id', 'defect_type_name'] }
    ];

    for (const table of keyTables) {
      try {
        console.log(`📊 ${table.name.toUpperCase()} TABLE:`);
        const fieldList = table.fields.join(', ');
        const [results] = await sequelize.query(`SELECT ${fieldList} FROM ${table.name}`);
        
        if (results.length > 0) {
          results.forEach((row, index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(row)}`);
          });
        } else {
          console.log('  No data found');
        }
        console.log('');
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkCurrentIds();
