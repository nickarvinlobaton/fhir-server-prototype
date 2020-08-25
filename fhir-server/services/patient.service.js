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
module.exports.searchById = (args, context, logger) =>
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

/**Custom operations for AGATE */

// Update or Create an agate record for a patient
module.exports.agateUpsert = (args, context, logger) =>
  new Promise((resolve, reject) => {
    const { req } = context;
    const type = "agate";
    let id = uuidv4();

    // Check if agate record already exists for a patient
    query
      .getAgate(type, args.id)
      .then((res) => {
        if (res.rows.length < 1) {
          let newAgate = {
            type: type,
            id: id,
            referenceId: args.id,
            weeklyRecord: [
              {
                date: moment.utc().format("YYYY-MM-DDTHH:mm:ssZ"),
                weight: req.query.weight,
                motivation: req.query.motivation,
                number: 1,
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
          let agate = res.rows[0].res;
          let newRecord = {
            date: moment.utc().format("YYYY-MM-DDTHH:mm:ssZ"),
            weight: req.query.weight,
            motivation: req.query.motivation,
            number:
              agate.weeklyRecord[agate.weeklyRecord.length - 1].number + 1,
          };

          agate.weeklyRecord.push(newRecord);

          // Update current agate weight to push new weight
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

// Retrieve an agate record for a patient
module.exports.agateFind = (args, context, logger) =>
  new Promise((resolve, reject) => {
    const type = "agate";
    query
      .getAgate(type, args.id)
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
        let weights = res.rows[0].res.weight;
        console.log(weights.reverse());
        return resolve(res.rows[0].res);
      })
      .catch((e) => {
        return reject(e);
      });
  });

// Computed agate score endpoint
module.exports.agateScore = (args, context, logger) =>
  new Promise((resolve, reject) => {
    let type = "agate";

    query.getAgate(type, args.id).then((res) => {
      // console.log(res.rows[0].res.weight);
      let weights = res.rows[0].res.weight;

      let WLS = 0; // Weight loss slope past 4 weeks
      let WW = 0; // Weight loss from past week

      //Sort
      let descSortedWeights = weights.sort((a, b) =>
        a.number > b.number ? -1 : 1
      );
      console.log(descSortedWeights);

      /**Todo: Check if weight array length is already 4. WLS needs at least 4 weeks of
       * weight record
       */

      // Compute WLS score
      if (
        parseFloat(descSortedWeights[0].value) -
          parseFloat(descSortedWeights[3].value) <
        0
      ) {
        WLS = 10;
      } else if (
        parseFloat(descSortedWeights[0].value) -
          parseFloat(descSortedWeights[3].value) ==
        0
      ) {
        WLS = 5;
      } else if (
        parseFloat(descSortedWeights[0].value) -
          parseFloat(descSortedWeights[3].value) >
        0
      ) {
        WLS = 0;
      }
      console.log("WLS = " + WLS);

      if (
        parseFloat(descSortedWeights[1].value) -
          parseFloat(descSortedWeights[0].value) >=
        0.5
      ) {
        WW = 5;
      } else if (
        parseFloat(descSortedWeights[1].value) -
          parseFloat(descSortedWeights[0].value) <
          0.5 ||
        parseFloat(descSortedWeights[1].value) -
          parseFloat(descSortedWeights[0].value) >
          -0.5
      ) {
        WW = 3;
      } else if (
        parseFloat(descSortedWeights[1].value) -
          parseFloat(descSortedWeights[0].value) <=
        -0.5
      ) {
        WW = 1;
      }
      console.log("WW = " + WW);
    });
  });
