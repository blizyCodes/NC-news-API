const db = require("../db/connection");

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [id]
  );
  const article = rows[0];
  if (!article) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
  return article;
};
