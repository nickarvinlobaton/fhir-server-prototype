const { constants } = require("@asymmetrik/node-fhir-server-core");
const { VERSIONS } = constants;

const config = {
  auth: {
    // This is so we know you want scope validation, without this, we would only
    // use the strategy
    type: "smart",
    // Define our strategy here, for smart to work, we need the name to be bearer
    // and to point to a service that exports a Smart on FHIR compatible strategy
    strategy: {
      name: "bearer",
      service: "./authentication.service.js",
    },
  },
  profiles: {
    Patient: {
      service: "./services/patient.service.js",
      versions: [VERSIONS["4_0_0"]],
      // Custom operations
      operation: [
        {
          name: "agate-upsert",
          route: "/agate-upsert",
          method: "POST",
        },
        {
          name: "agate-find",
          route: "/:id/agate-find",
          method: "GET",
        },
        {
          name: "agate-delete",
          route: "/agate-delete",
          method: "POST",
        },
        {
          name: "agate-score",
          route: "/:id/agate-score",
          method: "GET",
        },
      ],
    },
    Medication: {
      service: "./services/medication.service.js",
      versions: [VERSIONS["4_0_0"]],
    },
  },
};

module.exports = config;
