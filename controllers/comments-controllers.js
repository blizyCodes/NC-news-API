const {
  selectComments,
  insertComment,
  deleteCommentByCommentId,
} = require("../models/comments-models");
const { checkArticleExists } = require("../models/articles-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  Promise.all([selectComments(articleId), checkArticleExists(articleId)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  const { article_id: articleId } = req.params;
  Promise.all([
    checkArticleExists(articleId),
    insertComment(req.body, articleId),
  ])
    .then(([, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.removeComment = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  deleteCommentByCommentId(commentId)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      next(err);
    });
};
