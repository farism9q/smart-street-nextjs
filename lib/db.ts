import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL;

declare const global: {
  mongoose: any;
};

if (!MONGODB_URI) {
  throw new Error(
    "MongoDB connection string is not provided. Check the .env file."
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "DeepLearningCluster",
    };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(mongoose => {
      console.log("DB connected");
      return mongoose;
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

export default dbConnect;
