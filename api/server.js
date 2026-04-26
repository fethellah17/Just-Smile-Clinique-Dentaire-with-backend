import express from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categories.js';
import patientsRouter from './routes/patients.js';
import rendezVousRouter from './routes/rendez-vous.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/rendez-vous', rendezVousRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   Categories:`);
  console.log(`     GET    /api/categories`);
  console.log(`     POST   /api/categories`);
  console.log(`     PUT    /api/categories/:id`);
  console.log(`     DELETE /api/categories/:id`);
  console.log(`   Patients:`);
  console.log(`     GET    /api/patients`);
  console.log(`     POST   /api/patients`);
  console.log(`     PUT    /api/patients/:id`);
  console.log(`     DELETE /api/patients/:id`);
  console.log(`   Rendez-vous:`);
  console.log(`     GET    /api/rendez-vous`);
  console.log(`     POST   /api/rendez-vous`);
  console.log(`     PUT    /api/rendez-vous/:id`);
  console.log(`     DELETE /api/rendez-vous/:id`);
  console.log(`     GET    /api/rendez-vous/stats/dashboard`);
});
