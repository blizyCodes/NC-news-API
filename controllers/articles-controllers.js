const {
  selectArticleById,
  updateArticlebyId,
  selectArticles
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
  updateArticlebyId(req.body, articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req,res,next) => {
  selectArticles().then((articles) => {
    res.status(200).send({articles})
  })
}