import { serializeDocument, toDbId } from "../utils/mongoIds.js";

function normalizeMongoResult(result) {
  if (!result) return null;
  return result.value === undefined ? result : result.value;
}

export function createCrudRepository({
  collectionName,
  buildDocument,
  buildUpdate,
  buildSearchFilter,
  sanitize = (document) => document
}) {
  function collection(db) {
    return db.collection(collectionName);
  }

  async function create(db, input) {
    const document = buildDocument(input);
    const result = await collection(db).insertOne(document);
    return sanitize(serializeDocument({ ...document, _id: result.insertedId }));
  }

  async function findById(db, id) {
    const document = await collection(db).findOne({ _id: toDbId(id) });
    return sanitize(serializeDocument(document));
  }

  async function list(db) {
    const documents = await collection(db).find({}).sort({ createdAt: -1 }).toArray();
    return documents.map((document) => sanitize(serializeDocument(document)));
  }

  async function search(db, params) {
    const filter = buildSearchFilter(params);
    const documents = await collection(db).find(filter).sort({ createdAt: -1 }).toArray();
    return documents.map((document) => sanitize(serializeDocument(document)));
  }

  async function update(db, id, input) {
    const updated = await collection(db).findOneAndUpdate(
      { _id: toDbId(id) },
      { $set: buildUpdate(input) },
      { returnDocument: "after" }
    );

    return sanitize(serializeDocument(normalizeMongoResult(updated)));
  }

  async function remove(db, id) {
    const result = await collection(db).deleteOne({ _id: toDbId(id) });
    return result.deletedCount === 1;
  }

  return {
    create,
    findById,
    list,
    search,
    update,
    remove
  };
}
