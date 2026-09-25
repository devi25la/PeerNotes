const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const reportRoutes = require('./routes/reportRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const creditRoutes = require('./routes/creditRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Trust proxy for reverse proxy platforms like Render
app.set('trust proxy', 1);

// Configure CORS for both production (Vercel) and development (localhost)
const allowedOrigins = [
  'https://peer-notes-kadk.vercel.app',
  'https://peernotes-7ptp.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const cleanUrl = url.trim().replace(/\/$/, '');
    if (cleanUrl && !allowedOrigins.includes(cleanUrl)) {
      allowedOrigins.push(cleanUrl);
    }
  });
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, health checkers)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelDeploy = /\.vercel\.app$/.test(origin);
    const isLocalhost = /localhost(:\d+)?$/.test(origin) || /127\.0\.0\.1(:\d+)?$/.test(origin);

    if (isExplicitlyAllowed || isVercelDeploy || isLocalhost) {
      return callback(null, true);
    }

    // Default permissive callback so CORS is never blocked for deployed frontends
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'PeerNotes API Backend is running successfully',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'PeerNotes API',
    uptime: process.uptime(),
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Central error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
