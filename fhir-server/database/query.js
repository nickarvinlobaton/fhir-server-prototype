const cluster = require("./config");

// Bucket name
const bucketName = "fhir_sample";

const bucket = cluster.bucket(bucketName);
const collection = bucket.defaultCollection();

const query = {
  createResource: async (resourceType, doc) => {
    const key = `${resourceType}_${doc.id}`;

    let qs = `INSERT INTO \`${bucketName}\` (KEY, VALUE) VALUES ("${key}", ${JSON.stringify(
      doc
    )}) RETURNING *`;

    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      return e;
    }
  },
  getResourceById: async (resourceType, id) => {
    let qs = `SELECT *
      FROM \`${bucketName}\` res
      WHERE res.resourceType='${resourceType}'
      AND  res.id='${id}' LIMIT 1`;
    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      return e;
    }
  },
  deleteResource: async (resourceType, id) => {
    let qs = `DELETE FROM \`${bucketName}\` WHERE id='${id}' AND resourceType = '${resourceType}'`;
    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      return e;
    }
  },
  updateResource: async (resourceType, id, doc) => {
    let qs = `UPSERT INTO \`${bucketName}\` (KEY, VALUE)
    VALUES ("${resourceType}_${id}", ${JSON.stringify(doc)})`;

    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      return e;
    }
  },
};

module.exports = query;
