const fs = require("fs");
const path = require("path");

// Migration data templates for each table
const migrationData = {
  "release-type": {
    tableName: "release_type",
    hasTimestamps: false,
    data: [
      { release_type_name: "Major Release" },
      { release_type_name: "Minor Release" },
      { release_type_name: "Patch Release" },
      { release_type_name: "Hotfix" },
      { release_type_name: "Beta Release" },
    ],
    deleteField: "release_type_name",
    deleteValues: [
      "Major Release",
      "Minor Release",
      "Patch Release",
      "Hotfix",
      "Beta Release",
    ],
  },

  privilege: {
    tableName: "privilege",
    hasTimestamps: false,
    data: [
      { privilege_name: "Create Project" },
      { privilege_name: "Edit Project" },
      { privilege_name: "Delete Project" },
      { privilege_name: "View Project" },
      { privilege_name: "Assign Users" },
      { privilege_name: "Create Defect" },
      { privilege_name: "Edit Defect" },
      { privilege_name: "Delete Defect" },
      { privilege_name: "View Reports" },
      { privilege_name: "Manage Users" },
    ],
    deleteField: "privilege_name",
    deleteValues: [
      "Create Project",
      "Edit Project",
      "Delete Project",
      "View Project",
      "Assign Users",
      "Create Defect",
      "Edit Defect",
      "Delete Defect",
      "View Reports",
      "Manage Users",
    ],
  },

  "sub-module": {
    tableName: "sub_module",
    hasTimestamps: false,
    data: [
      {
        sub_module_id: "SUB001",
        sub_module_name: "User Registration",
        modules_id: 1,
      },
      { sub_module_id: "SUB002", sub_module_name: "User Login", modules_id: 2 },
      {
        sub_module_id: "SUB003",
        sub_module_name: "Password Reset",
        modules_id: 2,
      },
      {
        sub_module_id: "SUB004",
        sub_module_name: "Project Creation",
        modules_id: 3,
      },
      {
        sub_module_id: "SUB005",
        sub_module_name: "Defect Reporting",
        modules_id: 4,
      },
    ],
    deleteField: "sub_module_id",
    deleteValues: ["SUB001", "SUB002", "SUB003", "SUB004", "SUB005"],
  },

  project: {
    tableName: "project",
    hasTimestamps: false,
    data: [
      {
        project_id: "PROJ001",
        project_name: "E-Commerce Platform",
        client_name: "TechCorp Inc",
        description: "Online shopping platform development",
        email: "contact@techcorp.com",
        phone_no: "1234567890",
        country: "USA",
        state: "California",
        start_date: new Date("2024-01-01"),
        end_date: new Date("2024-12-31"),
        kloc: 50.5,
        project_status: "ACTIVE",
        user_Id: 1,
      },
    ],
    deleteField: "project_id",
    deleteValues: ["PROJ001"],
  },

  "smtp-config": {
    tableName: "smtp_config",
    hasTimestamps: false,
    data: [
      {
        name: "Default SMTP",
        smtp_host: "smtp.gmail.com",
        smtp_port: 587,
        username: "noreply@company.com",
        password: "encrypted_password",
        from_email: "noreply@company.com",
        from_name: "Company System",
      },
    ],
    deleteField: "name",
    deleteValues: ["Default SMTP"],
  },

  bench: {
    tableName: "bench",
    hasTimestamps: false,
    data: [
      { bench_id: "BENCH001", allocated: 0, availability: 1, user_id: 1 },
      { bench_id: "BENCH002", allocated: 1, availability: 0, user_id: 2 },
    ],
    deleteField: "bench_id",
    deleteValues: ["BENCH001", "BENCH002"],
  },

  "email-user": {
    tableName: "email_user",
    hasTimestamps: false,
    data: [
      {
        user_id: 1,
        defect_email_status: 1,
        module_allocation_email_status: 1,
        project_allocation_email_status: 1,
        submodule_allocation_email_status: 1,
      },
    ],
    deleteField: "user_id",
    deleteValues: [1],
  },
};

function generateMigrationContent(
  tableName,
  data,
  hasTimestamps,
  deleteField,
  deleteValues
) {
  const dataWithTimestamps = hasTimestamps
    ? data.map((item) => ({
        ...item,
        createdAt: "new Date()",
        updatedAt: "new Date()",
      }))
    : data;

  const dataStr = dataWithTimestamps
    .map((item) => {
      const fields = Object.entries(item)
        .map(([key, value]) => {
          if (value === "new Date()") {
            return `        ${key}: new Date()`;
          } else if (typeof value === "string") {
            return `        ${key}: "${value}"`;
          } else if (value instanceof Date) {
            return `        ${key}: new Date("${value.toISOString()}")`;
          } else {
            return `        ${key}: ${value}`;
          }
        })
        .join(",\n");
      return `      {\n${fields}\n      }`;
    })
    .join(",\n");

  const deleteValuesStr = deleteValues.map((v) => `"${v}"`).join(", ");

  return `'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Insert ${tableName} data
     */
    await queryInterface.bulkInsert('${tableName}', [
${dataStr}
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Remove ${tableName} data
     */
    await queryInterface.bulkDelete('${tableName}', {
      ${deleteField}: [${deleteValuesStr}]
    }, {});
  }
};`;
}

async function populateAllMigrations() {
  console.log("🚀 Populating all migration files with sample data...\n");

  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(migrationsDir);

  for (const [key, config] of Object.entries(migrationData)) {
    try {
      const migrationFile = files.find((f) => f.includes(`insert-${key}-data`));
      if (!migrationFile) {
        console.log(`⚠️  Migration file not found for ${key}`);
        continue;
      }

      const filePath = path.join(migrationsDir, migrationFile);
      const content = generateMigrationContent(
        config.tableName,
        config.data,
        config.hasTimestamps,
        config.deleteField,
        config.deleteValues
      );

      fs.writeFileSync(filePath, content);
      console.log(`✅ Populated ${migrationFile}`);
    } catch (error) {
      console.error(`❌ Error populating ${key}:`, error.message);
    }
  }

  console.log("\n🎉 Migration files populated successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Run: npm run migrate");
  console.log("2. Verify data with: node verify-data.js");
}

populateAllMigrations().catch(console.error);
