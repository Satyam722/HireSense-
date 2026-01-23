// 1. Load environment variables FIRST before any other imports
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Assuming you have job routes

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware: Production CORS Configuration
// This allows your specific Vercel domains to access your Render backend
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://hiresenseproject.vercel.app',
    'https://hiresense-nq28x2o4i-satyams-projects-e91b4b38.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
// app.use('/api/jobs', jobRoutes); // Uncomment if needed

// 5. Root Test Route
// Visit your Render URL in a browser to see if this returns "Healthy"
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '🚀 HireSense AI API is running...',
    status: 'Healthy',
    env: process.env.NODE_ENV || 'development'
  });
});

// 6. Catch-all for undefined routes
app.use((req, res) => {
  console.log(`❌ 404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found on server" });
});

// 7. Global Error Handler
// Prevents the server from crashing and hides stack traces in production
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
