import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


if(!process.env.MONGO_URI){
    throw new Error("Mongo_URI is not defined in your environment variables");
}

if(!process.env.JWT_SECRET_KEY){
    throw new Error("JWT_SECRET_KEY is not defined in your environment variables");
}

if(!process.env.MONGO_DB_NAME){
    throw new Error("MONGO_DB_NAME is not defined in your environment variables");
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in your environment variables");
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in your environment variables");
}

if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in your environment variables");
}

if(!process.env.GOOGLE_ACCESS_TOKEN){
    throw new Error("GOOGLE_ACCESS_TOKEN is not defined in your environment variables");
}

if(!process.env.GOOGLE_USER_EMAIL){
    throw new Error("GOOGLE_USER_EMAIL is not defined in your environment variables");
}

const config = {
  mongoURI: process.env.MONGO_URI, // MongoDB connection string from environment variables
  jwtSecretKey: process.env.JWT_SECRET_KEY, // JWT secret key from environment variables
  mongoDBName: process.env.MONGO_DB_NAME, // MongoDB database name from environment variables
  googleClientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Google refresh token from environment variables
  googleAccessToken: process.env.GOOGLE_ACCESS_TOKEN, // Google access token from environment variables
  googleUserEmail: process.env.GOOGLE_USER_EMAIL // Google user email from environment variables
};

export default config;