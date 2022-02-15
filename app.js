const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { invalidEndpoint } = require("./controllers/error-controllers");
const { getArticleById } = require("./controllers/articles-controllers");


const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//path not found
app.get("/*", invalidEndpoint);

//error handlers

module.exports = app;
