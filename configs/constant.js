import dotenv from "dotenv";
dotenv.config();

const ENV = {
    APP_PORT: process.env.APP_PORT,
    APP_ENV: process.env.APP_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    SYNC_SECRET: process.env.SYNC_API_SECRET_KEY,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
};

export { ENV };