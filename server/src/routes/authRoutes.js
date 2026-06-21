import { Router } from "express";

export function createAuthRouter({ authController, authenticate }) {
  const router = Router();

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.get("/me", authenticate, authController.me);

  return router;
}

