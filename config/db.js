const mongoose = require('mongoose');

const connectDB = async () => {
  const retryAttempts = 10;
  let attempt = 0;

  const connect = async () => {
    try {
      attempt++;
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      if (attempt < retryAttempts) {
        console.error(`Connection attempt ${attempt} failed: ${error.message}`);
        console.log('Retrying in 3 seconds...');
        setTimeout(connect, 3000); // Retry after 3 seconds
      } else {
        console.error(`Failed to connect to MongoDB after ${retryAttempts} attempts: ${error.message}`);
        process.exit(1); // Exit the process if we fail after multiple attempts
      }
    }
  };

  connect();
};

// Handling unhandled promise rejections globally
process.on('unhandledRejection', (error) => {
  console.error(`Unhandled Rejection: ${error.message}`);
  process.exit(1); // Exit the process when unhandled rejections occur
});

module.exports = connectDB;
