import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


if(!process.env.MONGO_URI){
    throw new Error("Mongo_URI is not defined in your environment variables");
}

if(!process.env.JWT_SECRET_KEY){
    throw new Error("JWT_SECRET_KEY is not defined in your environment variables");
}

const config = {
  mongoURI: process.env.MONGO_URI, // MongoDB connection string from environment variables
  jwtSecretKey: process.env.JWT_SECRET_KEY, // JWT secret key from environment variables
};

export default config;