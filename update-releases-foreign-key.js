const sequelize = require('./db');

async function updateReleasesForeignKey() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Check current releases table structure
    console.log('📊 Current releases table structure:');
    const [columns] = await sequelize.query('DESCRIBE releases');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key}`);
    });

    // Check current releases data
    console.log('\n📋 Current releases data:');
    const [releases] = await sequelize.query('SELECT id, release_id, release_name, release_type_id FROM releases');
    releases.forEach(r => {
      console.log(`  ID: ${r.id}, ${r.release_id}: ${r.release_name}, release_type_id: ${r.release_type_id}`);
    });

    // Get available project IDs
    const [projects] = await sequelize.query('SELECT id, project_id, project_name FROM project');
    console.log('\n📋 Available projects:');
    projects.forEach(p => {
      console.log(`  ID: ${p.id}, ${p.project_id}: ${p.project_name}`);
    });

    // Step 1: Add project_id column
    console.log('\n🔧 Step 1: Adding project_id column...');
    try {
      await sequelize.query(`
        ALTER TABLE releases 
        ADD COLUMN project_id bigint NULL
      `);
      console.log('✅ Added project_id column');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠️ project_id column already exists');
      } else {
        console.log(`❌ Error adding project_id column: ${error.message}`);
      }
    }

    // Step 2: Update releases with project_id values
    console.log('\n🔧 Step 2: Updating releases with project_id values...');
    const releaseProjectMappings = [
      { release_id: 'REL001', project_id: projects[0].id }, // E-Commerce Platform
      { release_id: 'REL002', project_id: projects[1].id }, // Mobile App Development
      { release_id: 'REL003', project_id: projects[2].id }, // Customer Support Portal
      { release_id: 'REL004', project_id: projects[3].id }, // Financial Analytics Dashboard
      { release_id: 'REL005', project_id: projects[4].id }, // Healthcare Management System
      { release_id: 'REL006', project_id: projects[5].id }  // Inventory Management API
    ];

    for (const mapping of releaseProjectMappings) {
      try {
        await sequelize.query(`
          UPDATE releases 
          SET project_id = ${mapping.project_id} 
          WHERE release_id = '${mapping.release_id}'
        `);
        console.log(`✅ Updated ${mapping.release_id} with project_id ${mapping.project_id}`);
      } catch (error) {
        console.log(`❌ Error updating ${mapping.release_id}: ${error.message}`);
      }
    }

    // Step 3: Add foreign key constraint
    console.log('\n🔧 Step 3: Adding foreign key constraint...');
    try {
      await sequelize.query(`
        ALTER TABLE releases 
        ADD CONSTRAINT fk_releases_project 
        FOREIGN KEY (project_id) REFERENCES project(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('✅ Added foreign key constraint for project_id');
    } catch (error) {
      console.log(`❌ Error adding foreign key constraint: ${error.message}`);
    }

    // Step 4: Optionally remove release_type_id column (commented out for safety)
    console.log('\n⚠️ Step 4: Keeping release_type_id column for now (you can remove it later if needed)');
    // Uncomment the following lines if you want to remove release_type_id column:
    /*
    try {
      await sequelize.query(`ALTER TABLE releases DROP COLUMN release_type_id`);
      console.log('✅ Removed release_type_id column');
    } catch (error) {
      console.log(`❌ Error removing release_type_id column: ${error.message}`);
    }
    */

    // Verification
    console.log('\n📊 Updated releases table:');
    const [updatedReleases] = await sequelize.query(`
      SELECT r.id, r.release_id, r.release_name, r.project_id, p.project_name
      FROM releases r
      LEFT JOIN project p ON r.project_id = p.id
    `);
    updatedReleases.forEach(r => {
      console.log(`  ${r.release_id}: ${r.release_name} → Project: ${r.project_name} (ID: ${r.project_id})`);
    });

    console.log('\n🎉 Successfully updated releases table with project_id foreign key!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

updateReleasesForeignKey();
