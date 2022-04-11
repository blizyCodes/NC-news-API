const {
  selectArticleById,
  updateArticlebyId,
  selectArticles,
  checkTopicExists,
  insertArticle,
  deleteArticleById,
  checkArticleExists,
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  Promise.all([selectArticleById(articleId), checkArticleExists(articleId)])
    .then(([article]) => {
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
  const { sort_by: sortBy, order, topic, limit, p: page } = req.query;
  Promise.all([
    selectArticles(sortBy, order, topic, limit, page),
    checkTopicExists(topic),
  ])
    .then(([articlesWithCount]) => {
      const articles = articlesWithCount[0]; //array of articles based on limit
      const total_count = articlesWithCount[1]; //count of all articles based on topic if specified.
      res.status(200).send({ articles, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};

exports.removeArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  Promise.all([checkArticleExists(articleId), deleteArticleById(articleId)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
