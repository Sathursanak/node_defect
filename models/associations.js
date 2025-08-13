const Designation = require("./designation");
const User = require("./user");
const Project = require("./project");
const Modules = require("./modules");
const Sub_module = require("./sub_module");
const User_privilege = require("./user_privilege");
const Privilege = require("./privilege");
const Group_privilege = require("./group_privilege");
const Project_allocation = require("./project_allocation");
const Project_allocation_history = require("./project_allocation_history");
const Releases = require("./releases");
const Smtp_config = require("./smtp_config");
const Test_case = require("./test_case");
const Release_test_case = require("./release_test_case");
const Comments = require("./comments");
const Defect_history = require("./defect_history");
const Defect = require("./defect");
const Bench = require("./bench");
const Allocate_module = require("./allocate_module");
const Email_user = require("./email_user");
const Project_user_privilege = require("./project_user_privilege");
const Release_type = require('./release_type');
const Defect_type = require('./defect_type');
const Severity = require('./severity');
const Role = require('./role');
const Defect_status = require('./defect_status');
const Priority = require('./priority');

// Designation  can have many users, user can have 1 
Designation.hasMany(User, {
  foreignKey: 'designation_id'
});

User.belongsTo(Designation,{
  foreignKey:'designation_id',
});

// user put into bench for project allocation user_id is FK, one bench is assigned to exactly one user 
User.hasOne(Bench,{
  foreignKey: "user_id"
});

Bench.belongsTo(User,{
  foreignKey:"user_id"
});

// user can assign to many project, project can have 1 user (Manager, this assign when project is created other users not directly added its added through project allocation) 
User.hasMany(Project, {
  foreignKey: 'user_Id',
});

Project.belongsTo(User, {
  foreignKey: 'user_Id',
});


// project has many module, module in 1 project  project_id is the FK
Project.hasMany(Modules, {
  foreignKey: 'project_id',
});

Modules.belongsTo(Project, {
  foreignKey: 'project_id',
});


// module has many sub_modules,  1 submodule  come under 1 module  sub_module_id
Modules.hasMany(Sub_module,{
  foreignKey: 'modules_id',
});

Sub_module.belongsTo(Modules,{
  foreignKey: 'modules_id',
});

// one project can have many allocation records , one allocation record point to one project
Project.hasMany(Project_allocation,{
  foreignKey: 'project_id',
})

Project_allocation.belongsTo(Project,{
  foreignKey: 'project_id',
});

// one user can have many allocation records , one allocation record point to one user
User.hasMany(Project_allocation,{
  foreignKey: 'user_id',
});

Project_allocation.belongsTo(User,{
  foreignKey: 'user_id',
});

// one module_allocation can have many users, one user can have one module_allocation
User.hasOne(Allocate_module,{
  foreignKey: 'user_id',
});

Allocate_module.belongsTo(User,{
  foreignKey: 'user_id',
});

// one module_allocation can have many modules, one module can have one module_allocation
Modules.hasOne(Allocate_module,{
  foreignKey: 'modules_id',
});

Allocate_module.belongsTo(Modules,{
  foreignKey: 'modules_id',
});


//one module_allocation can have many sub_modules, one sub_module can have one module_allocation
Sub_module.hasOne(Allocate_module,{
  foreignKey: 'sub_module_id',
});

Allocate_module.belongsTo(Sub_module,{
  foreignKey: 'sub_module_id',
});

//one module_allocation can have project, one project can have one module_allocation
Project.hasOne(Allocate_module,{
  foreignKey: 'project_id',
});

Allocate_module.belongsTo(Project,{
  foreignKey: 'project_id',
});


// A role can be assigned to many project allocations, but each project allocation has only one role
Role.hasMany(Project_allocation,{
  foreignKey: 'role_id',
});

Project_allocation.belongsTo(Role,{
  foreignKey: 'role_id',
});

// Project has many release, release belongs to one release
Project.hasMany(Releases,{
  foreignKey: 'project_id',
});

Releases.belongsTo(Project,{
  foreignKey: 'project_id'
});


//release has one release type, releasetype hase many releases
Release_type.hasMany(Releases,{
  foreignKey: 'release_type_id',
});

Release_type.belongsTo(Releases,{
  foreignKey: 'release_type_id'
});

//  testcase has one defect tpe, defect type can have many testcases
Defect_type.hasMany(Test_case,{
  foreignKey: 'defect_type_id',
});

Test_case.belongsTo(Defect_type,{
  foreignKey: 'defect_type_id',
});

// one module can have many testcases, one testcase can have one module
Modules.hasMany(Test_case,{
  foreignKey: 'modules_id',
});

Test_case.belongsTo(Modules,{
  foreignKey: 'modules_id',
});


// test_case has one project , project can have many testcases
Project.hasMany(Test_case,{
  foreignKey: 'project_id',
});

Test_case.belongsTo(Project,{
  foreignKey: 'project_id',
});


//severity has many testcases, one testcase can have one severity
Severity.hasMany(Test_case,{
foreignKey: 'severity_id',
});

Test_case.belongsTo(Severity,{
  foreignKey: 'severity_id',
});


// sub_module has many testcases, one testcase can have one sub_module
Sub_module.hasMany(Test_case,{
  foreignKey: 'sub_module_id',
});

Test_case.belongsTo(Sub_module,{
  foreignKey: 'sub_module_id',
});

// In execution, 1 release can have many test cases stored in release_testcase table , 1 testcase can have one release 
Releases.hasMany(Release_test_case,{
  foreignKey: 'release_id',
});

Release_test_case.belongsTo(Releases,{
  foreignKey: 'release_id',
});

// release_test_case has many test_case, one test_case can have one release_test_case
Test_case.hasMany(Release_test_case,{
  foreignKey: 'test_case_id',
});

Release_test_case.belongsTo(Test_case,{
  foreignKey: 'test_case_id',
});


// user can have many release_test_case, one release_test_case can have one user
User.hasMany(Release_test_case,{
  foreignKey: 'user_id',
});

Release_test_case.belongsTo(User,{
  foreignKey: 'user_id',
});

// defect can have one defect_type, one defect_type can have many defects
Defect_type.hasMany(Defect,{
  foreignKey: 'defect_type_id',
});

Defect.belongsTo(Defect_type,{
  foreignKey: 'defect_type_id',
});

// defect can have one user as assigned_by, one user can have many defects
User.hasMany(Defect,{
  foreignKey: 'assigned_by',
});

Defect.belongsTo(User, {
  foreignKey: 'assigned_by',
  as: 'assignedBy'
});

// defect can have one user as assigned_to, one user can have many defects
User.hasMany(Defect,{
  foreignKey: 'assigned_to',
});

Defect.belongsTo(User, {
  foreignKey: 'assigned_to',
  as: 'assignedTo'
});

// defect has 1 defect_status, one defect_status can have many defects
Defect_status.hasMany(Defect,{
  foreignKey: 'defect_status_id',
});

Defect.belongsTo(Defect_status,{
  foreignKey: 'defect_status_id',
});


// defect can have 1 module, one module can have many defects
Modules.hasMany(Defect,{
  foreignKey: 'modules_id',
});

Defect.belongsTo(Modules,{
  foreignKey: 'modules_id',
});

// Priority has many defects, one defect can have one priority
Priority.hasMany(Defect,{
  foreignKey: 'priority_id',
});

Defect.belongsTo(Priority,{
  foreignKey: 'priority_id',
});

// project can have many defects, one defect can have one project
Project.hasMany(Defect,{
  foreignKey: 'project_id',
});

Defect.belongsTo(Project,{
  foreignKey: 'project_id',
});


// release_test_case have many  defect in release table, 1 defect can have one release_test_case
Release_test_case.hasMany(Defect,{
  foreignKey: 'release_test_case_id',
});

Defect.belongsTo(Release_test_case,{
  foreignKey: 'release_test_case_id',
});

// Severity has many defects, one defect can have one severity
Severity.hasMany(Defect,{
  foreignKey: 'severity_id',
});
Defect.belongsTo(Severity,{
  foreignKey: 'severity_id',
});

// sub_module has many defects, one defect can have one sub_module
Sub_module.hasMany(Defect,{
  foreignKey: 'sub_module_id',
});
Defect.belongsTo(Sub_module,{
  foreignKey: 'sub_module_id',
});

// defect has many comments, one comment can have one defect
Defect.hasMany(Comments,{
  foreignKey: 'defect_id',
});
Comments.belongsTo(Defect,{
  foreignKey: 'defect_id',
});

User.hasMany(Comments,{
  foreignKey: 'user_id',
});

Comments.belongsTo(User,{
  foreignKey: 'user_id',
});


//defect has many defect_history, one defect_history can have one defect
Defect.hasMany(Defect_history,{
  foreignKey: 'defect_id',
});
Defect_history.belongsTo(Defect,{
  foreignKey: 'defect_id',
});

//user has many user privilages
User.hasMany(User_privilege,{
  foreignKey:'user_Id',
});

User_privilege.belongsTo(User,{
  foreignKey:'user_Id',
});


// project can have many user_privilages, user_privilages can have 1 project
Project.hasMany(User_privilege,{
  foreignKey: 'project_id',
});

User_privilege.belongsTo(Project,{
  foreignKey: 'project_id',
});

// privilage can have  many user_privilage, 1 user_privilagecome under one privilage
Privilege.hasMany(User_privilege,{
  foreignKey: 'privilege_id'
});

User_privilege.belongsTo(Privilege,{
  foreignKey: 'privilege_id'
});

// privilage can have many group_privilege, one group_privilege can have one privilage
Privilege.hasMany(Group_privilege,{
  foreignKey: 'privilege_id',
});
Group_privilege.belongsTo(Privilege,{
  foreignKey: 'privilege_id',
});

// role can have many group_privilege, one group_privilege can have one role
Role.hasMany(Group_privilege,{
  foreignKey: 'role_id',
});
Group_privilege.belongsTo(Role,{
  foreignKey: 'role_id',
});

//project can have many project_allocation_history, one project_allocation_history can have one project
Project.hasMany(Project_allocation_history,{
  foreignKey: 'project_id',
});

Project_allocation_history.belongsTo(Project,{
  foreignKey: 'project_id',
});

//Privilages can have many Project_user_privilages , one project_user_privilage can have only one privilage
Privilege.hasMany(Project_user_privilege,{
  foreignKey:'privilege_id',
});

Project_user_privilege.belongsTo(Privilege,{
  foreignKey:'privilege_id',
});

//one project can have many Project_user_privilege, one Project_user_privilege belongs to one project
Project.hasMany(Project_user_privilege,{
  foreignKey:'project_id',
});

Project_user_privilege.belongsTo(Project,{
  foreignKey:'project_id',
});


// one user can have many Project_user_privilege, one Project_user_privilege belongs to one user
User.hasMany(Project_user_privilege,{
  foreignKey:'user_id',
});

Project_user_privilege.belongsTo(User,{
  foreignKey:'user_id',
});

// user can have many project_allocation_history, one project_allocation_history can have one user
User.hasMany(Project_allocation_history,{
  foreignKey: 'user_id',
});
Project_allocation_history.belongsTo(User,{
  foreignKey: 'user_id',
});

// role can have many project_allocation_history, one project_allocation_history can have one role
Role.hasMany(Project_allocation_history,{
  foreignKey: 'role_id',
});
Project_allocation_history.belongsTo(Role,{
  foreignKey: 'role_id',
});


// email_user have one user 
User.hasMany(Email_user, { 
  foreignKey: 'user_id' 
});

Email_user.belongsTo(User, 
  { foreignKey: 'user_id' 

});



module.exports = {
  Designation,
  User,
  Project,
  Modules,
  Sub_module,
  Privilege,
  User_privilege,
  Group_privilege,
  Project_allocation,
  Project_allocation_history,
  Releases,
  Release_test_case,
  Smtp_config,
  Test_case,
  Comments,
  Defect,
  Defect_history,
  Bench,
  Allocate_module,
  Email_user,
  Project_user_privilege,
  Release_type,
  Defect_type,
  Severity,
  Role,
  Defect_status,
  Priority
};
