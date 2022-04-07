const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api-router");

const {
  invalidEndpoint,
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

//path not found
app.get("/*", invalidEndpoint);

//error handlers
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
