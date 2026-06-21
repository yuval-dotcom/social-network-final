import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { createAuthController } from "./controllers/authController.js";
import { createGroupController } from "./controllers/groupController.js";
import { createPostController } from "./controllers/postController.js";
import { createStatsController } from "./controllers/statsController.js";
import { createUserController } from "./controllers/userController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAuthenticate } from "./middleware/authenticate.js";
import { notFound } from "./middleware/notFound.js";
import { createAuthRouter } from "./routes/authRoutes.js";
import { createGroupRouter } from "./routes/groupRoutes.js";
import { healthRouter } from "./routes/healthRoutes.js";
import { createPostRouter } from "./routes/postRoutes.js";
import { createStatsRouter } from "./routes/statsRoutes.js";
import { createUserRouter } from "./routes/userRoutes.js";
import { groupRepository } from "./repositories/groupRepository.js";
import { postRepository } from "./repositories/postRepository.js";
import { userRepository } from "./repositories/userRepository.js";
import { createAuthService } from "./services/authService.js";

export function createApp({ db } = {}) {
  const app = express();
  const allowedOrigins = new Set([
    env.clientOrigin,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin is not allowed: ${origin}`));
    }
  }));
  app.use(express.json());

  app.use("/api/health", healthRouter);

  if (db) {
    const authService = createAuthService({ db, jwtSecret: env.jwtSecret });
    const authController = createAuthController(authService);
    const authenticate = createAuthenticate(authService);
    const userController = createUserController({ users: userRepository });
    const groupController = createGroupController({ groups: groupRepository });
    const postController = createPostController({
      posts: postRepository,
      groups: groupRepository,
      users: userRepository
    });
    const statsController = createStatsController({
      posts: postRepository,
      groups: groupRepository
    });

    app.use("/api/auth", createAuthRouter({ authController, authenticate }));
    app.use((req, res, next) => {
      req.db = db;
      next();
    });
    app.use("/api/users", createUserRouter({ userController, authenticate }));
    app.use("/api/groups", createGroupRouter({ groupController, authenticate }));
    app.use("/api/posts", createPostRouter({ postController, authenticate }));
    app.use("/api/stats", createStatsRouter({ statsController, authenticate }));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
