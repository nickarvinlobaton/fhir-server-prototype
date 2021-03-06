const cluster = require("./config");

// Bucket name
const bucketName = process.env.COUCHBASE_BUCKET;

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
  /** Agate query */
  getAgate: async (type, id) => {
    let qs = `SELECT * FROM \`${bucketName}\` res WHERE res.type='${type}' AND res.referenceId='${id}'`;

    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      return e;
    }
  },
  upsertAgate: async (type, id, doc) => {
    let qs = `UPSERT INTO \`${bucketName}\` (KEY, VALUE)
    VALUES ("${type}_${id}", ${JSON.stringify(doc)})  RETURNING *`;

    try {
      let result = await cluster.query(qs);
      console.log(qs);
      return result;
    } catch (e) {
      console.log("err");
      return e;
    }
  },
  deleteAgate: async (type, id) => {
    let qs = `DELETE FROM \`${bucketName}\` WHERE type='${type}' AND referenceId='${id}'`;

    try {
      let result = await cluster.query(qs);
      console.log(qs);
      return result;
    } catch (e) {
      console.log("err");
      return e;
    }
  },
  filterAgateRecordByMonth: async (type, id) => {
    let qs = `SELECT filtered_record
    FROM \`fhir_sample\` res
    UNNEST res.record as filtered_record
    WHERE res.type='${type}' AND res.referenceId='${id}' AND filtered_record.date BETWEEN DATE_ADD_STR(CLOCK_STR(),-1,"month") AND CLOCK_STR()`;

    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      console.log("err");
      return e;
    }
  },
  filterAgateRecordByWeek: async (type, id) => {
    let qs = `SELECT filtered_record
    FROM \`fhir_sample\` res
    UNNEST res.record as filtered_record
    WHERE res.type='${type}' AND res.referenceId='${id}' AND filtered_record.date BETWEEN DATE_ADD_STR(CLOCK_STR(),-7,"day") AND CLOCK_STR();`;

    try {
      let result = await cluster.query(qs);
      return result;
    } catch (e) {
      console.log("err");
      return e;
    }
  },
};

module.exports = query;
