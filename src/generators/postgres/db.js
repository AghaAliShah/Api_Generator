require("dotenv").config();
const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // PostgreSQL username
  process.env.DB_PASS, // PostgreSQL password
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Set to true to see raw SQL queries
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
