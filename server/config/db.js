const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/peernotes';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Could not connect to ${uri}`);
    console.error(`Detail: ${error.message}`);
    console.log('💡 TIP: Provide a valid MongoDB Atlas connection string in server/.env (MONGODB_URI) or ensure local MongoDB is running.');
    throw error;
  }
};

module.exports = connectDB;
