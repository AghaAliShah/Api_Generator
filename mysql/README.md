# MySQL API Generator

## Overview
This folder contains the implementation for generating RESTful APIs for MySQL databases. It uses Node.js, Express, and MySQL2 to interact with a MySQL database.

---

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (v20.18.0 or later).
2. **MySQL**: A running MySQL instance with the required database and tables.
3. **Environment Variables**: Configure the `.env` file with your MySQL database credentials:
   ```properties
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=1234
   MYSQL_DATABASE=test_db
   ```

---

## Folder Structure
- **`db.js`**: Handles the connection to the MySQL database using the `mysql2` library.
- **`mysql.js`**: Contains the controller logic for interacting with the database, including fetching, inserting, and deleting records.
- **`routes.js`**: Defines the API routes for interacting with the MySQL database.
- **`.env`**: Stores the environment variables for database configuration.
- **`server.js`**: The entry point for the MySQL API server.

---

## How to Run the API
1. Navigate to the `mysql` folder:
   ```bash
   cd mysql
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. The API will be available at:
   ```plaintext
   http://localhost:3000
   ```

---

## API Endpoints

### **1. GET All Records from a Table**
- **Method**: `GET`
- **URL**: `/mysql/:table`
- **Description**: Fetch all records from the specified table.
- **Example**: `/mysql/users`

### **2. POST Insert a New Record**
- **Method**: `POST`
- **URL**: `/mysql/:table`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON): The data to insert into the table.
- **Example**: `/mysql/users`
  ```json
  {
    "name": "andrew gabriel",
    "email": "andrew.gabriel@example.com"
  }
  ```

### **3. DELETE a Record by ID**
- **Method**: `DELETE`
- **URL**: `/mysql/:table/:id`
- **Description**: Delete a record from the specified table by its ID.
- **Example**: `/mysql/users/1`

---

## Troubleshooting
1. **Cannot Connect to MySQL**:
   - Ensure the `.env` file contains the correct database credentials.
   - Verify that the MySQL server is running and accessible.

2. **Missing Dependencies**:
   - Run `npm install` to ensure all required packages are installed.

3. **Table Not Found**:
   - Ensure the table exists in the database specified in the `.env` file.

---

## Notes
- Replace `:table` in the endpoints with the actual table name (e.g., `users`, `orders`).
- The API dynamically handles CRUD operations for any table in the database.
- Ensure proper validation and security measures are implemented for production use.