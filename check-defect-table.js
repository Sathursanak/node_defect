const sequelize = require('./db');

async function checkDefectTable() {
  try {
    await sequelize.authenticate();
    
    const [results] = await sequelize.query('DESCRIBE defect');
    console.log('Defect table structure:');
    results.forEach(col => {
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`  ${col.Field}: ${col.Type} ${nullable}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDefectTable();
