import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Fallback to a local URI if the environment variable is not defined
    const connURI = process.env.MONGO_URI;

    const conn = await mongoose.connect(connURI);

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Database Connection Error: ${error.message}`);
    process.exit(1); // Stop the server application immediately if connection fails
  }
};

export default connectDB;
