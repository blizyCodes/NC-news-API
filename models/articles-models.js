const db = require("../db/connection");

exports.selectArticleById = async (id) => {
  const {rows} = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [id]
  );
  console.log({rows}, rows, "model");
  return rows[0];
};
