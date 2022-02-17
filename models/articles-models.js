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

exports.selectArticles = async (sort_by = "created_at", order = "desc") => {
  const { rows } = await db.query(
    `SELECT * FROM articles ORDER BY ${sort_by} ${order};`
  );
  return rows;
};

exports.selectComments = async (id) => {
  const { rows } = await db.query(
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1;",
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({
      status: 404,
      msg: "no comments found for this article",
    });
  console.log(rows);
  return rows;
};
