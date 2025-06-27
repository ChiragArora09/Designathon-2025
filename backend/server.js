const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

// ROUTES
const maverickRoutes = require('./routes/maverickRoutes');
const batchRoutes = require('./routes/batchRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
})); // Enable CORS for frontend-backend communication

app.use(express.json()); // Parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Optional: Parse form-data (not needed with multer for now)

app.use(cookieParser());

// Serve static files (optional, for uploaded CSVs or images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for CSV file upload
const upload = multer({
  dest: path.join(__dirname, 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') cb(null, true);
    else cb(new Error('Only CSV files are allowed!'));
  },
});

// CSV Upload Endpoint (Single Route)
app.post('/upload-students', upload.single('file'), maverickRoutes);

// API Routes
app.use('/api', authRoutes);
app.use('/api/maverick', maverickRoutes);
app.use('/api/batch', batchRoutes);

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error("❌ Error caught:", err.message);
  res.status(500).json({ message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});