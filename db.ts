import mongoose from "mongoose";

// to avoid to make multiple db connections in multiple serverless invocations
let isConnected: mongoose.ConnectionStates = 0;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    isConnected = conn.connection.readyState;
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
