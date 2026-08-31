import mongoose from 'mongoose';

export let isMongoConnected = false;

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fridge_to_table';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // Quick timeout for graceful fallback
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoURI}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[MongoDB] Local connection unavailable (${err.message}). Operating in zero-config in-memory database mode.`);
  }
}
