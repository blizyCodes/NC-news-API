const db = require("../db/connection");

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    "SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
    [id]
  );
  const article = rows[0];
  if (!article) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
  return article;
};

exports.updateArticlebyId = async (voteUpdates, id) => {
  if (
    Object.keys(voteUpdates).length === 0 ||
    Object.values(voteUpdates).length === 0
  ) {
    return Promise.reject({ status: 400, msg: "no updates requested" });
  }
  const { inc_votes: votes } = voteUpdates;
  const { rows } = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [votes, id]
  );
  const article = rows[0];

  if (!article) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
  return article;
};
