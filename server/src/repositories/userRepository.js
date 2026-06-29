import {
  USER_COLLECTION,
  buildUserDocument,
  buildUserSearchFilter,
  buildUserUpdate,
  publicUser
} from "../models/userModel.js";
import { createCrudRepository } from "./crudRepository.js";

export const userRepository = {
  ...createCrudRepository({
    collectionName: USER_COLLECTION,
    buildDocument: buildUserDocument,
    buildUpdate: buildUserUpdate,
    buildSearchFilter: buildUserSearchFilter,
    sanitize: publicUser
  }),

  async findByUsername(db, username) {
    const user = await db
      .collection(USER_COLLECTION)
      .findOne({ username: String(username).toLowerCase() });
    return user || null;
  }
};
