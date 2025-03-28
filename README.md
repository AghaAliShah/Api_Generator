# Api_Generator

## Overview
This project is an automatic API generator that dynamically creates RESTful endpoints for database tables. It uses Node.js, Express, and Sequelize to interact with a PostgreSQL database.

---

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (v20.18.0 or later).
2. **PostgreSQL**: A running PostgreSQL instance with the required database and tables.
3. **Environment Variables**: Configure the `.env` file with your database credentials:
   ```properties
   DB_HOST=localhost
   DB_PORT=5433
   DB_USER=postgres
   DB_PASS=passw
   DB_NAME=sample
   ```

   If your database is running on a remote server, update the `DB_HOST` value to the remote server's IP address or hostname:
   ```properties
   DB_HOST=remote-server-ip-or-hostname
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=power123
   DB_NAME=sample
   ```

---

## How to Run the API
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. The API will be available at:
   ```plaintext
   http://localhost:3000
   ```

---

## Testing the API
Use **Postman** or any HTTP client to test the API. All routes are prefixed with `/api`.

### Sample Endpoints

#### **1. GET All Records from a Table**
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/users`
- **Description**: Fetch all records from the `users` table.

#### **2. GET a Record by ID**
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/users/1`
- **Description**: Fetch a record with ID `1` from the `users` table.

#### **3. POST a New Record**
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/users`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
  }
  ```

#### **4. PUT (Update) a Record**
- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/users/1`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "name": "Jane Updated",
    "email": "jane.updated@example.com"
  }
  ```

#### **5. DELETE a Record**
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/users/1`
- **Description**: Delete the record with ID `1` from the `users` table.

---

## Troubleshooting
1. **Cannot GET /users**:
   - Ensure you are using the correct route with the `/api` prefix (e.g., `/api/users`).
   - Verify that the database connection is successful and the `users` table exists.

2. **Database Connection Error**:
   - Check your `.env` file for correct database credentials.
   - Ensure the PostgreSQL server is running and accessible.

3. **Missing Dependencies**:
   - Run `npm install` to ensure all required packages are installed.

---

## Notes
- The API dynamically generates routes for all tables in the database.
- Replace `users` in the examples above with other table names (e.g., `posts`, `comments`) to test those endpoints.
- If your database is running on a remote server, ensure the `DB_HOST` value in the `.env` file is updated accordingly, and the remote server allows external connections.
