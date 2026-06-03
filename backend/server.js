const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const pool = require('./src/config/db');
const PORT = process.env.PORT || 5000;

//API routes
const userRoutes = require('./src/routes/userRoutes');
const incidentRoutes = require('./src/routes/incidentRoutes');


const app = express();

app.use(express.json());
app.use(cors());


// Define routes
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);


async function startServer() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

startServer();