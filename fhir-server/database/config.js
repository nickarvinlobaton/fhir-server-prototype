const couchbase = require("couchbase");

const cluster = new couchbase.Cluster("couchbase://localhost", {
  username: process.env.COUCHBASE_USERNAME,
  password: process.env.COUCHBASE_PASSWORD,
});

module.exports = cluster;
