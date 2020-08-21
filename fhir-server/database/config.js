const couchbase = require("couchbase");

const cluster = new couchbase.Cluster("couchbase://localhost", {
  username: "Administrator",
  password: "password",
});

module.exports = cluster;
