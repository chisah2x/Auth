import mongoose from 'mongoose';
import config from "./config.js";

async function connectDB(){
    try {
        // Connection can fail due to DNS/TLS/auth issues; log context then rethrow.
        await mongoose.connect(config.mongoURI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }

}

export default connectDB;