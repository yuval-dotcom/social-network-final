import { POST_COLLECTION, buildPostDocument, buildPostSearchFilter, buildPostUpdate } from "../models/postModel.js";
import { createCrudRepository } from "./crudRepository.js";

export const postRepository = createCrudRepository({
  collectionName: POST_COLLECTION,
  buildDocument: buildPostDocument,
  buildUpdate: buildPostUpdate,
  buildSearchFilter: buildPostSearchFilter
});

