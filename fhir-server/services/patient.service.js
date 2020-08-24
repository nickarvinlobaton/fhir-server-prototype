const {
  resolveSchema,
  ServerError,
} = require("@asymmetrik/node-fhir-server-core");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const jsonpatch = require("fast-json-patch");

const query = require("../database/query");

// Resource Type
const resourceType = "Patient";

module.exports.search = async (args, context) => {
  throw new Error("Unable to locate patients");
};

module.exports.create = (args, { req }, logger) =>
  new Promise((resolve, reject) => {
    let Patient = require(resolveSchema(args.base_version, resourceType));
    let Meta = require(resolveSchema(args.base_version, "meta"));
    let doc = new Patient(req.body).toJSON();
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
        logger.error("Error with Patient.create");
        return reject(e);
      });
  });

// Search Patient resource by ID
module.exports.searchById = (args, contexts, logger) =>
  new Promise((resolve, reject) => {
    let Patient = require(resolveSchema(args.base_version, resourceType));

    query
      .getResourceById(resourceType, args.id)
      .then((res) => {
        if (res.rows.length < 1) {
          let message = "No Patient resource with the given ID found.";
          throw new ServerError(message, {
            // Set this to make the HTTP status code 409
            statusCode: 404,
            // Add any normal operation outcome stuff here
            issue: [
              {
                severity: "error",
                code: "internal",
                details: { text: message },
              },
            ],
          });
        }
        return resolve(new Patient(res.rows[0].res));
      })
      .catch((e) => {
        return reject(e);
      });
  });

// Remove Patient resource
module.exports.remove = (args, contexts, logger) =>
  new Promise((resolve, reject) => {
    query
      .deleteResource(resourceType, args.id)
      .then(() => {
        return resolve();
      })
      .catch((e) => {
        logger.error("Error with Patient.delete");
        return reject({
          // Must be 405 (Method Not Allowed) or 409 (Conflict)
          // 405 if you do not want to allow the delete
          // 409 if you can't delete because of referential
          // integrity or some other reason
          code: 409,
          message:
            "Patient referenced in Observations and cannot be deleted. Please delete observations first.",
        });
      });
  });

// Update patient resource
module.exports.update = (args, { req }, logger) =>
  new Promise((resolve, reject) => {
    let Patient = require(resolveSchema(args.base_version, resourceType));
    let doc = new Patient(req.body).toJSON();

    // TODO: If resource is already present update meta

    query
      .updateResource(resourceType, args.id, doc)
      .then((res) => {
        return resolve({
          id: args.id,
          resource_version: "1",
        });
      })
      .catch((e) => {
        return reject(e);
      });
  });

// Patch Patient resource
module.exports.patch = (args, { req }, logger) =>
  new Promise((resolve, reject) => {
    let Patient = require(resolveSchema(args.base_version, resourceType));
    let patchContent = req.body;
    query
      .getResourceById(resourceType, args.id)
      .then((res) => {
        let current = res.rows[0].res;

        let patch = jsonpatch.applyPatch(current, patchContent).newDocument;
        let patchData = new Patient(patch).toJSON();

        query
          .updateResource(resourceType, current.id, patchData)
          .then((res) => {
            return resolve({
              id: args.id,
              resource_version: "1",
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

// Custom operations for AGATE
module.exports.agateUpsert = (args, context, logger) =>
  new Promise((resolve, reject) => {
    const { req } = context;
    const type = "agate";
    let id = uuidv4();

    // Check if agate record already exists
    query
      .getAgate(type, args.id)
      .then((res) => {
        if (res.rows.length < 1) {
          console.log("if");
          let newAgate = {
            type: type,
            id: id,
            referenceId: args.id,
            weight: [
              {
                date: moment.utc().format("YYYY-MM-DDTHH:mm:ssZ"),
                value: req.query.weight,
              },
            ],
          };

          query
            .upsertAgate(type, id, newAgate)
            .then((res) => {
              console.log(newAgate);
              console.log(res.rows[0]);
              return resolve({
                id: newAgate.id,
              });
            })
            .catch((e) => {
              logger.error("Error with agate.create");
              return reject(e);
            });
        } else {
          // If already exists, push new weight to the agate record
          let newWeight = {
            date: moment.utc().format("YYYY-MM-DDTHH:mm:ssZ"),
            value: req.query.weight,
          };
          let agate = res.rows[0].res;
          agate.weight.push(newWeight);

          // Update current agate weight
          query
            .upsertAgate(type, agate.id, agate)
            .then((res) => {
              return resolve({
                id: agate.id,
              });
            })
            .catch((e) => {
              logger.error("Error with agate.create");
              return reject(e);
            });
        }
      })
      .catch((e) => {
        return reject(e);
      });
  });
