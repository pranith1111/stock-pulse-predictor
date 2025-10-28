import {
  type User,
  type InsertUser,
  type Review,
  type InsertReview,
  type ReviewWithUser,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { passwordHash: string }): Promise<User>;
  updateUserWatchlist(userId: string, watchlist: string[]): Promise<void>;

  // Review operations
  getReviews(): Promise<ReviewWithUser[]>;
  getReviewById(id: string): Promise<Review | undefined>;
  getReviewsByUserId(userId: string): Promise<Review[]>;
  createReview(review: InsertReview & { userId: string }): Promise<Review>;
  deleteReview(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.reviews = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser & { passwordHash: string }): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      passwordHash: insertUser.passwordHash,
      watchlist: [],
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserWatchlist(userId: string, watchlist: string[]): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.watchlist = watchlist;
      this.users.set(userId, user);
    }
  }

  async getReviews(): Promise<ReviewWithUser[]> {
    const reviews = Array.from(this.reviews.values());
    return reviews.map((review) => {
      const user = this.users.get(review.userId);
      return {
        ...review,
        userName: user?.name || "Unknown User",
      };
    });
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByUserId(userId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter((review) => review.userId === userId);
  }

  async createReview(insertReview: InsertReview & { userId: string }): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      id,
      userId: insertReview.userId,
      stockSymbol: insertReview.stockSymbol,
      rating: insertReview.rating,
      comment: insertReview.comment,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async deleteReview(id: string): Promise<void> {
    this.reviews.delete(id);
  }
}

export const storage = new MemStorage();
