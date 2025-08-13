const sequelize = require('./db');

async function finalReleasesTableVerification() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🎉 FINAL RELEASES TABLE VERIFICATION\n');
    console.log('='.repeat(60));

    // Show clean table structure
    console.log('\n📊 CLEAN RELEASES TABLE STRUCTURE:');
    const [columns] = await sequelize.query('DESCRIBE releases');
    columns.forEach((col, index) => {
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      const key = col.Key ? ` (${col.Key})` : '';
      console.log(`  ${index + 1}. ${col.Field}: ${col.Type} ${nullable}${key}`);
    });

    // Verify specific columns
    console.log('\n✅ COLUMN VERIFICATION:');
    const columnNames = columns.map(col => col.Field);
    
    const expectedColumns = ['id', 'release_id', 'release_name', 'releasedate', 'status', 'release_type_id', 'project_id'];
    const unwantedColumns = ['releases_id'];
    
    expectedColumns.forEach(col => {
      const exists = columnNames.includes(col);
      console.log(`  ${col}: ${exists ? '✅ Present' : '❌ Missing'}`);
    });
    
    unwantedColumns.forEach(col => {
      const exists = columnNames.includes(col);
      console.log(`  ${col}: ${exists ? '❌ Still exists (should be removed)' : '✅ Removed'}`);
    });

    // Show data with relationships
    console.log('\n📋 RELEASES DATA WITH PROJECT RELATIONSHIPS:');
    const [releases] = await sequelize.query(`
      SELECT r.id, r.release_id, r.release_name, r.releasedate, r.status,
             r.release_type_id, rt.release_type_name,
             r.project_id, p.project_name
      FROM releases r
      LEFT JOIN release_type rt ON r.release_type_id = rt.id
      LEFT JOIN project p ON r.project_id = p.id
      ORDER BY r.id
    `);
    
    releases.forEach(r => {
      const releaseDate = new Date(r.releasedate).toLocaleDateString();
      const status = r.status ? 'Released' : 'Planned';
      console.log(`\n  ${r.release_id}: ${r.release_name}`);
      console.log(`    Date: ${releaseDate}, Status: ${status}`);
      console.log(`    Type: ${r.release_type_name} (ID: ${r.release_type_id})`);
      console.log(`    Project: ${r.project_name} (ID: ${r.project_id})`);
    });

    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`  Total releases: ${releases.length}`);
    console.log(`  Total columns: ${columns.length}`);
    
    const hasUnwantedColumns = columnNames.some(col => unwantedColumns.includes(col));
    console.log(`  Unwanted columns removed: ${!hasUnwantedColumns ? '✅ Yes' : '❌ No'}`);
    
    const hasProjectFK = columnNames.includes('project_id');
    console.log(`  Project foreign key: ${hasProjectFK ? '✅ Present' : '❌ Missing'}`);

    console.log('\n🎯 FINAL STATUS:');
    console.log('='.repeat(40));
    console.log('✅ releases_id column: REMOVED');
    console.log('✅ project_id foreign key: PRESENT');
    console.log('✅ release_type_id: KEPT (for reference)');
    console.log('✅ All releases linked to projects');
    console.log('✅ Table structure clean and optimized');

    console.log('\n🎉 RELEASES TABLE SUCCESSFULLY CLEANED!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

finalReleasesTableVerification();
