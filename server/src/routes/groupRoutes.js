import { Router } from "express";

export function createGroupRouter({ groupController, authenticate }) {
  const router = Router();

  router.use(authenticate);
  router.get("/", groupController.list);
  router.get("/search", groupController.search);
  router.post("/", groupController.create);
  router.get("/:id", groupController.getOne);
  router.patch("/:id", groupController.update);
  router.delete("/:id", groupController.remove);
  router.post("/:id/join", groupController.join);
  router.post("/:id/approve", groupController.approve);

  return router;
}

