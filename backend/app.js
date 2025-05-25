
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import middleware
const { authenticate } = require('./middleware/auth');
const { requestLogger } = require('./middleware/logging');

// Import routes
const vapiRoutes = require('./routes/vapi');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
// Add this before your CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key, ngrok-skip-browser-warning');
  next();
});


// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Authentication middleware for all /vapi routes
// app.use('/vapi', authenticate);

// Routes
app.use('/vapi', vapiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Vapi Triage Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /vapi/verifyIdentity',
      'POST /vapi/getAppointmentDetails',
      'GET /vapi/health'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('[Global Error Handler]', error.message);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Vapi Triage Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 API Key protection: ${process.env.VAPI_API_KEY ? 'enabled' : 'disabled'}`);
  console.log(`🗄️  Supabase URL: ${process.env.SUPABASE_URL ? 'configured' : 'missing'}`);
});

module.exports = app;
