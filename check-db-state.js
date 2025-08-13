const sequelize = require('./db');

async function checkDbState() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check if tables exist
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log(`📊 Found ${tables.length} tables in database:`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    // Check modules table specifically
    console.log('\n🔍 Checking modules table:');
    try {
      const [modules] = await sequelize.query('SELECT id, module_id, module_name FROM modules');
      console.log(`Found ${modules.length} modules:`);
      modules.forEach(m => {
        console.log(`  ID: ${m.id}, Module ID: ${m.module_id}, Name: ${m.module_name}`);
      });
    } catch (error) {
      console.log('❌ Modules table error:', error.message);
    }

    // Check sub_module table
    console.log('\n🔍 Checking sub_module table:');
    try {
      const [subModules] = await sequelize.query('SELECT id, sub_module_id, sub_module_name, modules_id FROM sub_module');
      console.log(`Found ${subModules.length} sub-modules:`);
      subModules.forEach(sm => {
        console.log(`  ID: ${sm.id}, Sub-Module ID: ${sm.sub_module_id}, Name: ${sm.sub_module_name}, Modules ID: ${sm.modules_id}`);
      });
    } catch (error) {
      console.log('❌ Sub-modules table error:', error.message);
    }

    // Check migration status
    console.log('\n📋 Checking migration status:');
    try {
      const [migrations] = await sequelize.query('SELECT name FROM SequelizeMeta ORDER BY name');
      console.log(`Found ${migrations.length} completed migrations:`);
      migrations.forEach(m => {
        console.log(`  - ${m.name}`);
      });
    } catch (error) {
      console.log('❌ Migration table error:', error.message);
    }

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDbState();
