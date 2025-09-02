// Test percentage calculation logic
function testPercentageCalculation() {
  console.log('Testing percentage calculation...\n');
  
  // Mock data similar to what the API returns
  const mockResults = [
    { defect_type_name: 'UI Bug', valid_defect_count: 6 },
    { defect_type_name: 'Functional Bug', valid_defect_count: 4 },
    { defect_type_name: 'Performance', valid_defect_count: 3 },
    { defect_type_name: 'Security', valid_defect_count: 2 }
  ];
  
  // Calculate total valid defects
  const totalValidDefects = mockResults.reduce((sum, row) => sum + parseInt(row.valid_defect_count), 0);
  console.log('Total valid defects:', totalValidDefects);
  
  // Calculate percentages
  mockResults.forEach(row => {
    const validDefects = parseInt(row.valid_defect_count);
    const percentage = totalValidDefects > 0 ? parseFloat(((validDefects / totalValidDefects) * 100).toFixed(2)) : 0;
    
    console.log(`${row.defect_type_name}: ${validDefects} defects (${percentage}%)`);
  });
  
  // Verify total percentage
  const totalPercentage = mockResults.reduce((sum, row) => {
    const validDefects = parseInt(row.valid_defect_count);
    const percentage = totalValidDefects > 0 ? (validDefects / totalValidDefects) * 100 : 0;
    return sum + percentage;
  }, 0);
  
  console.log(`\nTotal percentage: ${totalPercentage.toFixed(2)}%`);
  
  if (Math.abs(totalPercentage - 100) < 0.01) {
    console.log('✅ Percentages add up to 100%');
  } else {
    console.log('❌ Percentages don\'t add up to 100%');
  }
}

testPercentageCalculation();
