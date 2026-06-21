function matches(document, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "$or") {
      return expected.some((option) => matches(document, option));
    }

    const actual = document[key];

    if (expected instanceof RegExp) {
      if (Array.isArray(actual)) {
        return actual.some((item) => expected.test(String(item)));
      }
      return expected.test(String(actual || ""));
    }

    if (expected && typeof expected === "object" && !(expected instanceof Date)) {
      if (expected.$gte && new Date(actual) < new Date(expected.$gte)) return false;
      if (expected.$lte && new Date(actual) > new Date(expected.$lte)) return false;
      return true;
    }

    if (Array.isArray(actual)) {
      return actual.includes(expected);
    }

    return actual === expected;
  });
}

function createFakeCollection(initialDocuments = []) {
  let nextId = initialDocuments.length + 1;
  const documents = initialDocuments.map((document, index) => ({
    _id: document._id || `fake_${index + 1}`,
    ...document
  }));

  return {
    async insertOne(document) {
      const insertedId = `fake_${nextId++}`;
      documents.push({ _id: insertedId, ...document });
      return { insertedId };
    },

    async findOne(filter) {
      return documents.find((document) => matches(document, filter)) || null;
    },

    find(filter) {
      return {
        sort() {
          return this;
        },
        async toArray() {
          return documents.filter((document) => matches(document, filter));
        }
      };
    },

    async findOneAndUpdate(filter, update) {
      const document = documents.find((item) => matches(item, filter));
      if (!document) return null;

      Object.assign(document, update.$set || {});
      return document;
    },

    async deleteOne(filter) {
      const index = documents.findIndex((document) => matches(document, filter));
      if (index === -1) return { deletedCount: 0 };

      documents.splice(index, 1);
      return { deletedCount: 1 };
    },

    all() {
      return documents;
    }
  };
}

export function createFakeDb(seed = {}) {
  const collections = new Map();

  return {
    collection(name) {
      if (!collections.has(name)) {
        collections.set(name, createFakeCollection(seed[name] || []));
      }

      return collections.get(name);
    }
  };
}

