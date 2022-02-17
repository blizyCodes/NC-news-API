const db = require("../db/connection");


exports.selectComments = async (id) => {
    const { rows } = await db.query(
      "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1;",
      [id]
    );
  
    return rows;
  };