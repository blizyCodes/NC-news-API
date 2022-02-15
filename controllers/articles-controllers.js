const { selectArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  selectArticleById(articleId).then((article) => {
    console.log({article}, "controller");
    res.status(200).send({article});
  });
};
