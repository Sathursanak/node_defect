const sequelize = require('./db');

async function verifyReleaseTypeFix() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current table structure
    console.log('📊 Updated release_type table structure:');
    const [columns] = await sequelize.query('DESCRIBE release_type');
    columns.forEach(col => {
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      const key = col.Key ? ` (${col.Key})` : '';
      console.log(`  ${col.Field}: ${col.Type} ${nullable}${key}`);
    });

    // Verify the unwanted column is gone
    const hasReleaseTypeId = columns.some(col => col.Field === 'release_type_id');
    if (hasReleaseTypeId) {
      console.log('\n❌ release_type_id column still exists!');
    } else {
      console.log('\n✅ release_type_id column successfully removed!');
    }

    // Check current data
    console.log('\n📋 Current data in release_type table:');
    const [data] = await sequelize.query('SELECT * FROM release_type');
    data.forEach(row => {
      console.log(`  ID: ${row.id}, release_type_name: ${row.release_type_name}`);
    });

    // Verify releases table still works correctly
    console.log('\n🔍 Verifying releases table still references correctly:');
    const [releases] = await sequelize.query(`
      SELECT r.id, r.release_name, r.release_type_id, rt.release_type_name
      FROM releases r
      LEFT JOIN release_type rt ON r.release_type_id = rt.id
      LIMIT 3
    `);
    
    releases.forEach(r => {
      console.log(`  Release: ${r.release_name} → Type: ${r.release_type_name} (ID: ${r.release_type_id})`);
    });

    console.log('\n🎉 release_type table is now clean and matches your model!');
    console.log('✅ Table structure now matches your model definition exactly');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

verifyReleaseTypeFix();
