const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parses JSON bodies

// Mount Routes
app.use('/api/auth', authRoutes); // Handles /api/auth/register & login
app.use('/api/applications', applicationRoutes); // Handles /api/applications/apply

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found on server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));