import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_DB_URI || 'mongodb+srv://shreyassutardelxn:k1rKLrSjSeurO2y@elite.apjxdxd.mongodb.net/?retryWrites=true&w=majority&appName=elite';
const DB_NAME = process.env.DB_NAME || 'Eliet-section';
                                                
if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_DB_URI environment variable inside .env.local');
}

if (!DB_NAME) {
  throw new Error('Please define the DB_NAME environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('🔌 Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔌 Creating new connection...');
    console.log('   URI:', MONGODB_URI.substring(0, 50) + '...');
    console.log('   DB Name:', DB_NAME);
    
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 20000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      ssl: true
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connection established successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ Connection failed:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 