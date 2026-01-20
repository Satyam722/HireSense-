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

// --- CRITICAL UPDATE 1: CORS ---
// Instead of just app.use(cors()), restrict it to your specific frontend URL
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Add a Root Route (Helpful for checking if the server is live)
app.get("/", (req, res) => {
  res.send("HireSense API is running successfully.");
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found on server" });
});

// --- CRITICAL UPDATE 2: HOST BINDING ---
const PORT = process.env.PORT || 5000;
// Adding "0.0.0.0" ensures Render can map its external IP to your app
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});