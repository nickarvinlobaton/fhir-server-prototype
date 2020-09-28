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
    },
    Medication: {
      service: "./services/medication.service.js",
      versions: [VERSIONS["4_0_0"]],
    },
  },
};

module.exports = config;
