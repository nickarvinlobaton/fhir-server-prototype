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
    console.log(req.body);

    // Check if agate record already exists for a patient
    query
      .getAgate(type, req.body.id)
      .then((res) => {
        if (res.rows.length < 1) {
          let newAgate = {
            type: type,
            id: id,
            referenceId: req.body.id,
            weeklyRecord: [
              {
                date: moment.utc().format("YYYY-MM-DDTHH:mm:ssZ"),
                weight: req.body.weight,
                motivation: req.body.motivation,
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
            weight: req.body.weight,
            motivation: req.body.motivation,
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
        // console.log(res.rows[0].res.weight);
        let records = res.rows[0].res.weeklyRecord;

        let WLS = 0; // Weight loss slope past 4 weeks
        let WW = 0; // Weight loss from past week
        let MN = 0; // Motivation

        //Sort
        let descSortedRecords = records.sort((a, b) =>
          a.number > b.number ? -1 : 1
        );
        console.log(descSortedRecords);

        MN = parseInt(descSortedRecords[0].motivation);

        /**Todo: Check if weight array length is already 4. WLS needs at least 4 weeks of
         * weight record
         */

        if (descSortedRecords.length < 4) {
          let message =
            "Cant compute agate score with less than 4 weeks record";
          throw new ServerError(message, {
            statusCode: 400,
            issue: [
              {
                severity: "error",
                code: "internal",
                details: { text: message },
              },
            ],
          });
        } else {
          if (
            parseFloat(descSortedRecords[0].weight) -
              parseFloat(descSortedRecords[3].weight) <
            0
          ) {
            WLS = 10;
          } else if (
            parseFloat(descSortedRecords[0].weight) -
              parseFloat(descSortedRecords[3].weight) ==
            0
          ) {
            WLS = 5;
          } else if (
            parseFloat(descSortedRecords[0].weight) -
              parseFloat(descSortedRecords[3].weight) >
            0
          ) {
            WLS = 0;
          }

          // Compute WW
          if (
            parseFloat(descSortedRecords[1].weight) -
              parseFloat(descSortedRecords[0].weight) >=
            0.5
          ) {
            WW = 5;
          } else if (
            parseFloat(descSortedRecords[1].weight) -
              parseFloat(descSortedRecords[0].weight) <
              0.5 &&
            parseFloat(descSortedRecords[1].weight) -
              parseFloat(descSortedRecords[0].weight) >
              -0.5
          ) {
            WW = 3;
          } else if (
            parseFloat(descSortedRecords[1].weight) -
              parseFloat(descSortedRecords[0].weight) <=
            -0.5
          ) {
            WW = 1;
          }
          console.log("WLS = " + +WLS);
          console.log("WW = " + +WW);
          console.log("MN = " + +MN);

          // Compute AGATE score and set Interpretation message based on score
          const agateScore = WLS + WW + MN;
          let interpretation = "";
          if (agateScore >= 21 && agateScore <= 25) {
            interpretation = "Highly engaged and motivated";
          } else if (agateScore >= 16 && agateScore <= 20) {
            interpretation = "Moderately engaged and motivated";
          } else if (agateScore >= 11 && agateScore <= 15) {
            interpretation =
              "Minimally engaged/Somewhat vulnerable to drop off";
          } else if (agateScore >= 6 && agateScore <= 10) {
            interpretation = "Highly vulnerable to dropping off";
          } else if (agateScore >= 0 && agateScore <= 5) {
            interpretation = "Extremely vulnerable to dropping off";
          }

          return resolve({
            message: "AGATE score",
            score: agateScore,
            interpretation: interpretation,
          });
        }
      })
      .catch((e) => {
        return reject(e);
      });
  });
