// 1. Load environment variables FIRST
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');

// 2. Connect to Database
connectDB();

// 3. Verify Cloudinary Configuration
cloudinary.api.ping()
  .then(res => console.log("✅ Cloudinary Connected Successfully"))
  .catch(err => console.error("❌ Cloudinary Connection Failed:", err.message));

const app = express();

// 4. Global Middleware - Configured for Production
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://hiresenseproject.vercel.app',
    'https://hiresense-nq28x2o4i-satyams-projects-e91b4b38.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. API Routes
// Note: Ensure your frontend api.js uses these exact prefixes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// 6. Root Test Route (Check this at https://hiresense-server-yllu.onrender.com)
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '🚀 HireSense AI API is running...',
    status: 'Healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 7. 404 Handler for undefined routes
app.use((req, res, next) => {
  console.log(`❌ 404 Route Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found on server" });
});

// 8. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Internal Error Stack:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
