const path = require("path");
const express = require("express");

const config = require("./config");

const {
  initialize,
  loggers,
  constants,
} = require("@asymmetrik/node-fhir-server-core");

require("dotenv").config();

let app = express();

// Add router to express app
app.use("/api/agate", require("./routes/agate"));

let server = initialize(config, app);
let logger = loggers.get("default");

server.listen(3000, () => {
  logger.info("Starting the FHIR Server at localhost:3000");
});
