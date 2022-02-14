const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { invalidEndpoint } = require("./controllers/error-controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/*", invalidEndpoint);

module.exports = app;
