const articlesRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById,
  getArticles,
  postArticle,
  removeArticleById,
} = require("../controllers/articles-controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments-controllers");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(removeArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
