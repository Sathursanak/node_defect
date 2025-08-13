const express = require('express');
const app = express();
const sequelize = require('./db');

require('./models/designation'); 
require('./models/user');
require('./models/priority');
require('./models/role');
require('./models/severity'); 
require('./models/release_type');
require('./models/defect_type');
require('./models/defect_status');
require('./models/modules');
require('./models/project');
require('./models/sub_module');
require('./models/privilege');
require('./models/user_privilege');
require('./models/group_privilege');
require('./models/project_allocation');
require('./models/project_allocation_history');
require('./models/releases');
require('./models/smtp_config');
require('./models/test_case');
require('./models/release_test_case');
require('./models/comments');
require('./models/defect_history');
require('./models/defect');
require('./models/bench');
require('./models/allocate_module');
require('./models/email_user');
require('./models/project_user_privilege');
require('./models/release_type');
require('./models/defect_type');
require('./models/defect_status');
require('./models/priority');


require('./models/associations');

const designationRoutes = require('./routes/designationRoutes');
app.use(express.json());

app.use('/api/designations', designationRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects',projectRoutes);

// Root route
app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // This will now know about relationships
    res.send('Database connected successfully');
  } catch (error) {
    res.status(500).send('Connection failed: ' + error.message);
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
