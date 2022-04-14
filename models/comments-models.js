const { user } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.selectComments = async (id) => {
  const { rows } = await db.query(
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1;",
    [id]
  );

  return rows;
};

exports.insertComment = async (usersComment, id) => {
  const { username, body } = usersComment;
  if (
    Object.keys(usersComment).length === 0 ||
    Object.values(usersComment).length === 0
  ) {
    return Promise.reject({ status: 400, msg: "No comment submitted." });
  }
  const { rows } = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
    [id, username, body]
  );
  return rows[0];
};

exports.deleteCommentByCommentId = async (id) => {
  const { rows } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({ status: 404, msg: "Comment not found." });
};

exports.updateCommentById = async (incVotes, commentId) => {
  if (!incVotes) {
    return Promise.reject({ status: 400, msg: "No updates requested." });
  }
  const {
    rows: [comment],
  } = await db.query(
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
    [incVotes, commentId]
  );
  if (!comment)
    return Promise.reject({
      status: 404,
      msg: "Comment not found.",
    });
  return comment;
};
