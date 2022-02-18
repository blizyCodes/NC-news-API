const {
  selectArticleById,
  updateArticlebyId,
  selectArticles,
  checkTopicExists,
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

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;
  Promise.all([selectArticles(sortBy, order, topic), checkTopicExists(topic)])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};
