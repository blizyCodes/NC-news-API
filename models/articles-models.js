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

exports.selectArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  const sortByGreenList = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderGreenList = ["asc", "desc"];

  if (!sortByGreenList.includes(sort_by))
    return Promise.reject({
      status: 400,
      msg: `Unable to sort. Sorting by ${sort_by} is an invalid request`,
    });

  if (!orderGreenList.includes(order.toLowerCase()))
    return Promise.reject({
      status: 400,
      msg: `Unable to order. Ordering by notASortBy is an invalid request`,
    });

  let queryPsql = `SELECT
    articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author, 
    articles.created_at, 
    articles.votes,
    COUNT(comments.article_id)::int AS comment_count 
   FROM articles
   LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const givenTopic = [];
  if (topic) {
    queryPsql += ` WHERE articles.topic = $1`;
    givenTopic.push(topic);
  }

  queryPsql += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  const { rows } = await db.query(queryPsql, givenTopic);
  return rows;
};

exports.checkArticleExists = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
};

exports.checkTopicExists = async (topic) => {
  if (!topic) return Promise.resolve;
  const { rows } = await db.query("SELECT * FROM topics WHERE slug = $1;", [
    topic,
  ]);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "topic not found" });
  }
};

exports.insertArticle = async (newArticle) => {
  const { title, topic, author, body } = newArticle;
  if (
    !newArticle.title ||
    !newArticle.topic ||
    !newArticle.author ||
    !newArticle.body
  ) {
    return Promise.reject({ status: 400, msg: "missing required information" });
  }
  const {
    rows: [article],
  } = await db.query(
    `
    INSERT INTO articles
      (title, topic, author, body)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
    `,
    [title, topic, author, body]
  );
  article.comment_count = 0;
  return article;
};
