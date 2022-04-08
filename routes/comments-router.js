const commentsRouter = require("express").Router();

const {
  removeCommentByCommentId,
  patchCommentById,
} = require("../controllers/comments-controllers");

commentsRouter
  .route("/:comment_id")
  .delete(removeCommentByCommentId)
  .patch(patchCommentById);

module.exports = commentsRouter;
