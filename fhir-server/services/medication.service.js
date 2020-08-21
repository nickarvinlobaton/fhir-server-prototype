const { resolveSchema } = require("@asymmetrik/node-fhir-server-core");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const jsonpatch = require("fast-json-patch");

const query = require("../database/query");

// Resource Type
const resourceType = "Medication";

module.exports.create = (args, { req }, logger) =>
  new Promise((resolve, reject) => {
    let Medication = require(resolveSchema(args.base_version, resourceType));
    let Meta = require(resolveSchema(args.base_version, "meta"));
    let doc = new Medication(req.body).toJSON();
    doc.meta = new Meta({
      versionId: "1",
      lastUpdated: moment.utc().format("YYYY-MM-DDTHH:mm:ssZ"),
    });

    let id = uuidv4();
    doc.id = id;

    query
      .createResource(resourceType, doc)
      .then((res) => {
        console.log(res.rows[0]);
        return resolve({
          id: doc.id,
        });
      })
      .catch((e) => {
        logger.error("Error with Medication.create");
        return reject(e);
      });
  });

// Search Medication resource by ID
module.exports.searchById = (args, contexts, logger) =>
  new Promise((resolve, reject) => {
    let Medication = require(resolveSchema(args.base_version, resourceType));

    query
      .getResourceById(resourceType, args.id)
      .then((res) => {
        if (res.rows.length < 1) {
          // return reject({
          //   code: "404",
          //   message: "No Patient resource with the given ID found.",
          // });
          throw new Error("No Medication resource with the given ID found.");
        }
        return resolve(new Medication(res.rows[0].res));
      })
      .catch((e) => {
        return reject(e);
      });
  });

// Remove Medication resource
module.exports.remove = (args, contexts, logger) =>
  new Promise((resolve, reject) => {
    query
      .deleteResource(resourceType, args.id)
      .then(() => {
        return resolve();
      })
      .catch((e) => {
        logger.error("Error with Medication.delete");
        return reject({
          // Must be 405 (Method Not Allowed) or 409 (Conflict)
          // 405 if you do not want to allow the delete
          // 409 if you can't delete because of referential
          // integrity or some other reason
          code: 409,
          message: "Delete Error Message.",
        });
      });
  });

// Update Medication resource
module.exports.update = (args, { req }, logger) =>
  new Promise((resolve, reject) => {
    let Medication = require(resolveSchema(args.base_version, resourceType));
    let doc = new Medication(req.body).toJSON();

    // TODO: If resource is already present update meta

    query
      .updateResource(resourceType, args.id, doc)
      .then((res) => {
        return resolve({
          id: args.id,
        });
      })
      .catch((e) => {
        return reject(e);
      });
  });

// Patch Medication resource
module.exports.patch = (args, { req }, logger) =>
  new Promise((resolve, reject) => {
    let Medication = require(resolveSchema(args.base_version, resourceType));
    let patchContent = req.body;
    query
      .getResourceById(resourceType, args.id)
      .then((res) => {
        let current = res.rows[0].res;

        let patch = jsonpatch.applyPatch(current, patchContent).newDocument;
        let patchData = new Medication(patch).toJSON();

        query
          .updateResource(resourceType, current.id, patchData)
          .then((res) => {
            return resolve({
              id: args.id,
            });
          })
          .catch((e) => {
            return reject(e);
          });
      })
      .catch((e) => {
        return reject(e);
      });
  });
