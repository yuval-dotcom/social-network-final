import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { createAuthController } from "./controllers/authController.js";
import { createUserController } from "./controllers/userController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAuthenticate } from "./middleware/authenticate.js";
import { notFound } from "./middleware/notFound.js";
import { createAuthRouter } from "./routes/authRoutes.js";
import { healthRouter } from "./routes/healthRoutes.js";
import { createUserRouter } from "./routes/userRoutes.js";
import { userRepository } from "./repositories/userRepository.js";
import { createAuthService } from "./services/authService.js";

export function createApp({ db } = {}) {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  app.use("/api/health", healthRouter);

  if (db) {
    const authService = createAuthService({ db, jwtSecret: env.jwtSecret });
    const authController = createAuthController(authService);
    const authenticate = createAuthenticate(authService);
    const userController = createUserController({ users: userRepository });

    app.use("/api/auth", createAuthRouter({ authController, authenticate }));
    app.use((req, res, next) => {
      req.db = db;
      next();
    });
    app.use("/api/users", createUserRouter({ userController, authenticate }));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
