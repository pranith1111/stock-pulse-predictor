import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stockpulse';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected:', MONGO_URI); // Log this to the console
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);  // Exit if MongoDB connection fails
  }
};
