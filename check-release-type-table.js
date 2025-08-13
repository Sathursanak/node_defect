const sequelize = require('./db');

async function checkReleaseTypeTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current table structure
    console.log('📊 Current release_type table structure:');
    const [columns] = await sequelize.query('DESCRIBE release_type');
    columns.forEach(col => {
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      const key = col.Key ? ` (${col.Key})` : '';
      console.log(`  ${col.Field}: ${col.Type} ${nullable}${key}`);
    });

    // Check current data
    console.log('\n📋 Current data in release_type table:');
    const [data] = await sequelize.query('SELECT * FROM release_type');
    data.forEach(row => {
      console.log(`  ID: ${row.id}, release_type_name: ${row.release_type_name}, release_type_id: ${row.release_type_id}`);
    });

    // Check if release_type_id is used as foreign key anywhere
    console.log('\n🔍 Checking if release_type_id is referenced by other tables...');
    
    // Check releases table
    try {
      const [releases] = await sequelize.query('SELECT id, release_type_id FROM releases LIMIT 3');
      console.log('Releases table references:');
      releases.forEach(r => {
        console.log(`  Release ID: ${r.id}, release_type_id: ${r.release_type_id}`);
      });
    } catch (error) {
      console.log('No releases table or no data');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkReleaseTypeTable();
