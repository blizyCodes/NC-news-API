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
  getArticles,
} = require("./controllers/articles-controllers");

const {
  getCommentsByArticleId,
  postComment,
} = require("./controllers/comments-controllers");

const { getUsers } = require("./controllers/users-controllers");
const { getEndpoints } = require("./controllers/utility-controllers");

const app = express();
app.use(express.json());

//endpoints
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

//path not found
app.get("/*", invalidEndpoint);

//error handlers
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
