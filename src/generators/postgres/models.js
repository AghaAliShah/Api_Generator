const sequelize = require('./db');
const { DataTypes } = require('sequelize');

async function loadModels() {
  await sequelize.authenticate();
  
  // Query PostgreSQL information_schema to get all tables
  const [results] = await sequelize.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  
  console.log('Found tables:', results.map(r => r.table_name));
  
  let models = {};
  for (const result of results) {
    const tableName = result.table_name;
    
    // Get primary key information for this table
    const [primaryKeys] = await sequelize.query(`
      SELECT c.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
      JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
        AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
      WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = '${tableName}'
    `);
    
    // Get table columns to define model properly
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns
      WHERE table_name = '${tableName}'
    `);
    
    // Create a set of primary key column names for quick lookup
    const primaryKeyColumns = new Set(primaryKeys.map(pk => pk.column_name));
    
    const modelDefinition = {};
    columns.forEach(column => {
      // Simple type mapping - expand as needed
      let type = DataTypes.STRING;
      if (column.data_type.includes('int')) type = DataTypes.INTEGER;
      if (column.data_type.includes('bool')) type = DataTypes.BOOLEAN;
      if (column.data_type.includes('date')) type = DataTypes.DATE;
      
      // Set up column definition
      const columnDef = { type };
      
      // Mark as primary key if it's in our primary key set
      if (primaryKeyColumns.has(column.column_name)) {
        columnDef.primaryKey = true;
      }
      
      modelDefinition[column.column_name] = columnDef;
    });
    
    models[tableName] = sequelize.define(
      tableName,
      modelDefinition,
      { tableName, timestamps: false }
    );
  }
  
  return models;
}

module.exports = loadModels;