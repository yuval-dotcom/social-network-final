import {
  GROUP_COLLECTION,
  buildGroupDocument,
  buildGroupSearchFilter,
  buildGroupUpdate
} from "../models/groupModel.js";
import { createCrudRepository } from "./crudRepository.js";

export const groupRepository = createCrudRepository({
  collectionName: GROUP_COLLECTION,
  buildDocument: buildGroupDocument,
  buildUpdate: buildGroupUpdate,
  buildSearchFilter: buildGroupSearchFilter
});
