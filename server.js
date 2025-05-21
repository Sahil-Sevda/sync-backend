import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { ENV } from "./configs/constant.js";
import errorHandler from "./middlewares/error.handler.js";
import swaggerSpec from "./swagger/swagger.config.js";
import { connectDB } from "./db/mongodb.connection.js";
import mongoose from 'mongoose'

// PiSync routes
import syncRoutes from "./routes/sync.route.js";

const app = express();
app.set("trust proxy", true);

app.use(fileUpload());
const allowedOrigins = ENV.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Swagger
app.use("/swagger-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/v1/sync", syncRoutes);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    if (dbState === 1) {
      res.status(200).json({ status: "OK", db: "connected" });
    } else {
      res.status(500).json({ status: "DB not connected", dbState });
    }
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});
// Error handler
app.use(errorHandler);

// Start server
app.listen(ENV.APP_PORT || 3500, () => {
  if (ENV.APP_ENV === "development") {
    console.log(`Listening on port ${ENV.APP_PORT}`);
  }
  connectDB();
});
