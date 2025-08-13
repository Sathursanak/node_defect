const sequelize = require('./db');

async function checkProjectTableNulls() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔍 CHECKING PROJECT TABLE FOR NULL VALUES\n');

    // Show all project data
    console.log('📊 Current project table data:');
    const [projects] = await sequelize.query('SELECT * FROM project');
    projects.forEach(p => {
      console.log(`\nProject ID ${p.id}:`);
      console.log(`  project_id: ${p.project_id}`);
      console.log(`  project_name: ${p.project_name}`);
      console.log(`  client_name: ${p.client_name}`);
      console.log(`  description: ${p.description}`);
      console.log(`  email: ${p.email}`);
      console.log(`  phone_no: ${p.phone_no}`);
      console.log(`  country: ${p.country}`);
      console.log(`  state: ${p.state}`);
      console.log(`  start_date: ${p.start_date}`);
      console.log(`  end_date: ${p.end_date}`);
      console.log(`  kloc: ${p.kloc}`);
      console.log(`  project_status: ${p.project_status}`);
      console.log(`  user_Id: ${p.user_Id}`);
    });

    // Check for NULL values in each column
    console.log('\n🔍 Detailed NULL check for each column:');
    const columns = [
      'project_id', 'project_name', 'client_name', 'description', 
      'email', 'phone_no', 'country', 'state', 'start_date', 
      'end_date', 'kloc', 'project_status', 'user_Id'
    ];

    let totalNulls = 0;
    for (const column of columns) {
      const [nullCount] = await sequelize.query(`
        SELECT COUNT(*) as count FROM project WHERE ${column} IS NULL
      `);
      const count = nullCount[0].count;
      totalNulls += count;
      const status = count === 0 ? '✅' : '❌';
      console.log(`  ${status} ${column}: ${count} NULL values`);
    }

    // Show which specific records have NULLs
    if (totalNulls > 0) {
      console.log('\n📋 Records with NULL values:');
      for (const column of columns) {
        const [nullRecords] = await sequelize.query(`
          SELECT id, project_id, project_name FROM project WHERE ${column} IS NULL
        `);
        if (nullRecords.length > 0) {
          console.log(`\n${column} is NULL in:`);
          nullRecords.forEach(r => {
            console.log(`  - Project ${r.id} (${r.project_id}): ${r.project_name}`);
          });
        }
      }
    }

    console.log(`\n📈 SUMMARY:`);
    console.log(`Total projects: ${projects.length}`);
    console.log(`Total NULL values: ${totalNulls}`);
    
    if (totalNulls === 0) {
      console.log('\n🎉 PERFECT! NO NULL VALUES IN PROJECT TABLE!');
    } else {
      console.log(`\n⚠️ Found ${totalNulls} NULL values that need fixing`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkProjectTableNulls();
