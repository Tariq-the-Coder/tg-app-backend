const cluster = require('cluster');
const os = require('os');
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('./config/dotenv.config');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Number of CPU cores available on the machine
const numCores = os.cpus().length;

if (cluster.isMaster) {
  // Master process: Create worker processes for each CPU core
  console.log(`Master process started on PID ${process.pid}`);

  for (let i = 0; i < numCores; i++) {
    cluster.fork(); // Create a worker process for each CPU core
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker process: This is where the Express app will run
  const app = express();

  // Middleware
  app.use(express.json());

  // CORS Configuration
  app.use(
    cors({
      origin: 'https://open4profit.netlify.app', // Allow requests from frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-requested-with',
        'x-api-key',
      ],
      preflightContinue: false,
      optionsSuccessStatus: 200,
    })
  );

  // Connect to Database - Each worker process should connect to MongoDB
  connectDB();

  // Routes
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes); // Uncomment if required

  // Error Handling
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Worker process ${process.pid} listening on port ${PORT}`);
  });
}
