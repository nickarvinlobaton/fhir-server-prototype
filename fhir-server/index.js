const path = require("path");
const express = require("express");

const config = require("./config");

require("dotenv").config();

// AUTH for express routes, same as FHIR server
// Integrate it into your routes via middleware or some other mechanism
// Our strategy is a bearer strategy so use bearer for the name
const passport = require("passport");
let name = "bearer";
let options = { session: false };

// Initialize Express
let app = express();

// Add router to express app
app.use(
  "/api/agate",
  passport.authenticate(name, options),
  require("./routes/agate")
);

const {
  initialize,
  loggers,
  constants,
} = require("@asymmetrik/node-fhir-server-core");

let server = initialize(config, app);
let logger = loggers.get("default");

server.listen(3000, () => {
  logger.info("Starting the FHIR Server at localhost:3000");
});
