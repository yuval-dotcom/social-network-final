import { Router } from "express";

export function createUserRouter({ userController, authenticate }) {
  const router = Router();

  router.use(authenticate);
  router.get("/", userController.list);
  router.get("/search", userController.search);
  router.get("/:id", userController.getOne);
  router.patch("/:id", userController.update);
  router.delete("/:id", userController.remove);

  return router;
}
