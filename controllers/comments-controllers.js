const {selectComments } = require("../models/comments-models")
const {checkArticleExists} = require("../models/articles-models")

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id: articleId } = req.params;
    Promise.all([selectComments(articleId), checkArticleExists(articleId)])
      .then(([comments]) => {
        res.status(200).send({ comments });
      })
      .catch((err) => next(err));
  };