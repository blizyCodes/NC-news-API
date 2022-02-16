const {
  selectArticleById,
  updateArticlebyId,
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.patchArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  console.log(req.body);
  updateArticlebyId(req.body, articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
