exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23505") {
    res.status(400).send({ msg: "topic already exists" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "missing required information" });
  } else if (["2201W", "2201X"].includes(err.code)) {
    res
      .status(400)
      .send({ msg: "limit and p must be positive integers" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
