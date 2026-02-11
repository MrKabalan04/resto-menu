import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";

import categoryRoutes from "./routes/categoryRoutes";
import itemRoutes from "./routes/itemRoutes";
import offerRoutes from "./routes/offerRoutes";
import settingsRoutes from "./routes/settingsRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Lava Resto API" });
});

router.use("/categories", categoryRoutes);
router.use("/items", itemRoutes);
router.use("/offers", offerRoutes);
router.use("/settings", settingsRoutes);

app.use("/.netlify/functions/api", router);

export const handler = serverless(app);
