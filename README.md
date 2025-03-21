# School Management API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the `schools` table in your MySQL database:
   ```sql
   CREATE TABLE schools (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       address VARCHAR(255) NOT NULL,
       latitude FLOAT NOT NULL,
       longitude FLOAT NOT NULL
   );
   ```

3. Update the database connection details in `index.js` if necessary.

## Running the Server

Start the server:
```bash
npm start
```

## API Endpoints

### Add School

- **Endpoint:** `/addSchool`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "name": "Example School",
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```

### List Schools

- **Endpoint:** `/listSchools`
- **Method:** `GET`
- **Parameters:**
  - `latitude`: `40.7128`
  - `longitude`: `-74.0060`
