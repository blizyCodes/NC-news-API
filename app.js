const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const {
  invalidEndpoint,
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");
const { getArticleById } = require("./controllers/articles-controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//path not found
app.get("/*", invalidEndpoint);

//error handlers
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
