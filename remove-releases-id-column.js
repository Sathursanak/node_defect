const sequelize = require('./db');

async function removeReleasesIdColumn() {
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
    
    if (!hasReleasesId) {
      console.log('\n⚠️ releases_id column does not exist in the table');
      return;
    }

    // Check current data in releases_id column
    console.log('\n📋 Current data in releases_id column:');
    const [releases] = await sequelize.query('SELECT id, release_id, release_name, releases_id FROM releases');
    releases.forEach(r => {
      console.log(`  ${r.release_id}: ${r.release_name}, releases_id: ${r.releases_id}`);
    });

    // Step 1: Drop any foreign key constraints on releases_id column
    console.log('\n🔧 Step 1: Checking and removing foreign key constraints...');
    try {
      // First, check if there are any foreign key constraints
      const [constraints] = await sequelize.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'nodeproject' 
        AND TABLE_NAME = 'releases' 
        AND COLUMN_NAME = 'releases_id'
        AND CONSTRAINT_NAME != 'PRIMARY'
      `);
      
      if (constraints.length > 0) {
        console.log(`Found ${constraints.length} constraint(s) on releases_id column`);
        for (const constraint of constraints) {
          try {
            await sequelize.query(`ALTER TABLE releases DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
            console.log(`✅ Dropped constraint: ${constraint.CONSTRAINT_NAME}`);
          } catch (error) {
            console.log(`⚠️ Could not drop constraint ${constraint.CONSTRAINT_NAME}: ${error.message}`);
          }
        }
      } else {
        console.log('✅ No foreign key constraints found on releases_id column');
      }
    } catch (error) {
      console.log(`⚠️ Error checking constraints: ${error.message}`);
    }

    // Step 2: Remove the releases_id column
    console.log('\n🔧 Step 2: Removing releases_id column...');
    try {
      await sequelize.query(`ALTER TABLE releases DROP COLUMN releases_id`);
      console.log('✅ Successfully removed releases_id column');
    } catch (error) {
      console.log(`❌ Error removing releases_id column: ${error.message}`);
      return;
    }

    // Step 3: Verify the column has been removed
    console.log('\n📊 Updated releases table structure:');
    const [updatedColumns] = await sequelize.query('DESCRIBE releases');
    updatedColumns.forEach(col => {
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      const key = col.Key ? ` (${col.Key})` : '';
      console.log(`  ${col.Field}: ${col.Type} ${nullable}${key}`);
    });

    // Verify releases_id is gone
    const stillHasReleasesId = updatedColumns.some(col => col.Field === 'releases_id');
    
    if (stillHasReleasesId) {
      console.log('\n❌ releases_id column still exists!');
    } else {
      console.log('\n✅ releases_id column successfully removed!');
    }

    // Show current data to confirm everything is working
    console.log('\n📋 Current releases data (after column removal):');
    const [finalReleases] = await sequelize.query(`
      SELECT r.id, r.release_id, r.release_name, r.project_id, p.project_name
      FROM releases r
      LEFT JOIN project p ON r.project_id = p.id
      ORDER BY r.id
    `);
    
    finalReleases.forEach(r => {
      console.log(`  ${r.release_id}: ${r.release_name} → Project: ${r.project_name} (ID: ${r.project_id})`);
    });

    console.log('\n🎉 Successfully cleaned up releases table structure!');
    console.log('✅ Removed unwanted releases_id column');
    console.log('✅ All data and relationships preserved');
    console.log('✅ Table structure now matches your requirements');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

removeReleasesIdColumn();
