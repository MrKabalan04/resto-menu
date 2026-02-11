import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";

import categoryRoutes from "./routes/categoryRoutes";
import itemRoutes from "./routes/itemRoutes";
import offerRoutes from "./routes/offerRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection Middleware
const dbMiddleware = async (req: any, res: any, next: any) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

app.use(dbMiddleware);

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Lava Resto API" });
});

router.use("/categories", categoryRoutes);
router.use("/items", itemRoutes);
router.use("/offers", offerRoutes);
router.use("/settings", settingsRoutes);
router.use("/auth", authRoutes);

app.use("/.netlify/functions/api", router);

export const handler = serverless(app);
