import { Router } from "express";

export function createPostRouter({ postController, authenticate }) {
  const router = Router();

  router.use(authenticate);
  router.get("/", postController.list);
  router.get("/search", postController.search);
  router.get("/feed", postController.feed);
  router.get("/mine", postController.mine);
  router.post("/", postController.create);
  router.get("/:id", postController.getOne);
  router.patch("/:id", postController.update);
  router.delete("/:id", postController.remove);

  return router;
}

