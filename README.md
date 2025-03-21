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

- **Endpoint:** `https://school-dbms.onrender.com/api/addSchool `
- **Method:** `POST`
- **Payload:**
  ```json
    {
        "name": "Springfield Public School",
        "address": "789 Elm Street, City",
        "latitude": 28.7035,
        "longitude": 77.104,
        "distance": 0.16079076343751741
    }
  ```
![Screenshot 2025-03-21 233747](https://github.com/user-attachments/assets/c87cf02c-9809-4560-a54f-9fd428b809ff)

### List Schools

- **Endpoint:** `https://school-dbms.onrender.com/api/listSchools?latitude=28.7041&longitude=77.1025`
- **Method:** `GET`
- **Parameters:**
  - `latitude`: `40.7128`
  - `longitude`: `-74.0060`
![Screenshot 2025-03-21 235841](https://github.com/user-attachments/assets/b0c88f37-2e48-4ee8-8646-2c4e9a504be1)
