import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import mongoose from "mongoose"; // 👈 Import mongoose to check MongoDB status

const app = express();

// Middleware to handle rawBody in requests
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// 🧾 Add the "About" endpoint
app.get("/api/about", (_req: Request, res: Response) => {
  res.json({
    name: "StockPulse Predictor",
    version: "1.0.0",
    description: "A stock prediction platform using machine learning and sentiment analysis to forecast market trends.",
    author: "Pranitha",
    environment: app.get("env"),
    repository: "https://github.com/your-repo-link-here"
  });
});

// MongoDB health check route
app.get("/api/db-check", (_req: Request, res: Response) => {
  const state = mongoose.connection.readyState;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({ dbState: states[state] });
});

// 🧩 Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // MongoDB connection check
  const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stockpulse';
    try {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB connected:', MONGO_URI); // Log MongoDB connection success
    } catch (err) {
      console.error('❌ MongoDB connection error:', err); // Log MongoDB connection failure
      process.exit(1);  // Exit if MongoDB connection fails
    }
  };

  await connectDB(); // Ensure MongoDB is connected before proceeding

  const server = await registerRoutes(app);

  // 🧱 Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // 🧰 Vite setup
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 🚀 Start server
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "127.0.0.1", () => {
    log(`Server running on http://127.0.0.1:${port}`);
  });
})();
