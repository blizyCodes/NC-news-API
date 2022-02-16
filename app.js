const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const {
  invalidEndpoint,
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

//path not found
app.get("/*", invalidEndpoint);

//error handlers
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
