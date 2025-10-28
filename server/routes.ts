import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateToken, authMiddleware, type AuthRequest } from "./lib/jwt";
import { fetchStockQuote, fetchChartData, generatePrediction } from "./lib/stock-api";
import bcrypt from "bcryptjs";
import { insertUserSchema, loginSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
      });

      const token = generateToken({ userId: user.id, email: user.email });

      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.json({ token, user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken({ userId: user.id, email: user.email });

      const { passwordHash: _, ...userWithoutPassword } = user;
      
      res.json({ token, user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.get("/api/stocks/quote/:symbol", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { symbol } = req.params;
      const quote = await fetchStockQuote(symbol.toUpperCase());
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to fetch stock quote" });
    }
  });

  app.get("/api/stocks/chart/:symbol/:range", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { symbol, range } = req.params;
      const chartData = await fetchChartData(symbol.toUpperCase(), range);
      res.json(chartData);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to fetch chart data" });
    }
  });

  app.get("/api/predict/:symbol", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { symbol } = req.params;
      const quote = await fetchStockQuote(symbol.toUpperCase());
      const prediction = generatePrediction(quote);
      res.json(prediction);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to generate prediction" });
    }
  });

  app.get("/api/watchlist", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const user = await storage.getUser(userId);
      
      if (!user || !user.watchlist || user.watchlist.length === 0) {
        return res.json([]);
      }

      const watchlistWithData = await Promise.all(
        user.watchlist.map(async (symbol) => {
          try {
            const quote = await fetchStockQuote(symbol);
            return {
              ...quote,
              addedAt: new Date().toISOString(),
            };
          } catch (error) {
            return null;
          }
        })
      );

      const validWatchlist = watchlistWithData.filter((item) => item !== null);
      res.json(validWatchlist);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { symbol } = req.body;

      if (!symbol || typeof symbol !== "string") {
        return res.status(400).json({ message: "Symbol is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const upperSymbol = symbol.toUpperCase();
      
      if (user.watchlist.includes(upperSymbol)) {
        return res.status(400).json({ message: "Stock already in watchlist" });
      }

      const updatedWatchlist = [...user.watchlist, upperSymbol];
      await storage.updateUserWatchlist(userId, updatedWatchlist);

      res.json({ message: "Added to watchlist", symbol: upperSymbol });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:symbol", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { symbol } = req.params;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const upperSymbol = symbol.toUpperCase();
      const updatedWatchlist = user.watchlist.filter((s) => s !== upperSymbol);
      await storage.updateUserWatchlist(userId, updatedWatchlist);

      res.json({ message: "Removed from watchlist" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to remove from watchlist" });
    }
  });

  app.get("/api/reviews", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const validatedData = insertReviewSchema.parse(req.body);

      const review = await storage.createReview({
        ...validatedData,
        userId,
      });

      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  app.delete("/api/reviews/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const review = await storage.getReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this review" });
      }

      await storage.deleteReview(id);
      res.json({ message: "Review deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete review" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
