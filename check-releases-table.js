const sequelize = require('./db');

async function checkReleasesTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current releases table structure
    console.log('📊 Current releases table structure:');
    const [columns] = await sequelize.query('DESCRIBE releases');
    columns.forEach(col => {
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      const key = col.Key ? ` (${col.Key})` : '';
      console.log(`  ${col.Field}: ${col.Type} ${nullable}${key}`);
    });

    // Check if releases_id column exists
    const hasReleasesId = columns.some(col => col.Field === 'releases_id');
    console.log(`\nreleases_id column exists: ${hasReleasesId}`);

    if (hasReleasesId) {
      console.log('\n🔧 Need to remove releases_id column...');
      
      // Remove the column
      await sequelize.query(`ALTER TABLE releases DROP COLUMN releases_id`);
      console.log('✅ Successfully removed releases_id column');
      
      // Verify removal
      const [updatedColumns] = await sequelize.query('DESCRIBE releases');
      console.log('\n📊 Updated table structure:');
      updatedColumns.forEach(col => {
        const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
        const key = col.Key ? ` (${col.Key})` : '';
        console.log(`  ${col.Field}: ${col.Type} ${nullable}${key}`);
      });
      
      const stillHasReleasesId = updatedColumns.some(col => col.Field === 'releases_id');
      if (!stillHasReleasesId) {
        console.log('\n✅ releases_id column successfully removed!');
      }
    } else {
      console.log('\n✅ releases_id column does not exist (already removed or never existed)');
    }

    // Show current data
    console.log('\n📋 Current releases data:');
    const [releases] = await sequelize.query(`
      SELECT r.id, r.release_id, r.release_name, r.project_id, p.project_name
      FROM releases r
      LEFT JOIN project p ON r.project_id = p.id
      ORDER BY r.id
    `);
    
    releases.forEach(r => {
      console.log(`  ${r.release_id}: ${r.release_name} → Project: ${r.project_name}`);
    });

    console.log('\n🎉 Releases table structure verified!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkReleasesTable();
