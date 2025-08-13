# Database Migration Guide

This guide explains how to use Sequelize migrations to insert data into your database.

## Setup

The project is already configured with:
- Sequelize CLI installed as dev dependency
- `.sequelizerc` configuration file
- Proper `config/config.json` format
- Migration scripts in `package.json`

## Available Commands

```bash
# Run all pending migrations
npm run migrate

# Undo the last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Check migration status
npm run migrate:status
```

## Creating New Migration Files

To create a new migration file for inserting data:

```bash
npx sequelize-cli migration:generate --name insert-your-table-data
```

## Migration File Structure

Each migration file has two main functions:

### `up` function
- Executes when running migrations
- Contains the data insertion logic
- Use `queryInterface.bulkInsert()` to insert multiple records

### `down` function  
- Executes when undoing migrations
- Should reverse the changes made in `up`
- Use `queryInterface.bulkDelete()` to remove inserted data

## Examples

### Basic Data Insertion

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('table_name', [
    {
      column1: 'value1',
      column2: 'value2'
    },
    {
      column1: 'value3', 
      column2: 'value4'
    }
  ], {});
}
```

### Conditional Insertion

```javascript
async up(queryInterface, Sequelize) {
  // Check if data already exists
  const existing = await queryInterface.sequelize.query(
    "SELECT id FROM table_name WHERE column = 'value'",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );
  
  if (existing.length === 0) {
    await queryInterface.bulkInsert('table_name', [...], {});
  }
}
```

### With Timestamps

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('table_name', [
    {
      name: 'Sample',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
}
```

## Current Migration Files

1. `insert-designation-data.js` - Inserts sample designation data
2. `insert-sample-data-template.js` - Template with various examples

## Running Your First Migration

1. Make sure your MySQL database is running
2. Ensure the database `nodeproject` exists
3. Run: `npm run migrate`

## Best Practices

1. Always provide a proper `down` function to reverse changes
2. Use descriptive migration names
3. Insert data in logical order (parent tables before child tables)
4. Consider using conditional checks to avoid duplicate data
5. Test your migrations in development before production

## Troubleshooting

- If migration fails, check your database connection in `config/config.json`
- Ensure all referenced tables exist before inserting data
- Check for foreign key constraints when inserting related data
- Use `npm run migrate:status` to see which migrations have run
