exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "path not found" });
};
