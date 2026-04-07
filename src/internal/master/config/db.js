import mongoose from 'mongoose';

import env from '../../../config/env.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    if (!env.mongodbUri) {
      throw new Error('Missing MONGODB_URI');
    }

    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected.');
    });

  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;




