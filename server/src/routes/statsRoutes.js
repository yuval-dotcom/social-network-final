import { Router } from "express";

export function createStatsRouter({ statsController, authenticate }) {
  const router = Router();

  router.use(authenticate);
  router.get("/posts-by-month", statsController.postsByMonth);
  router.get("/posts-by-group", statsController.postsByGroup);

  return router;
}

