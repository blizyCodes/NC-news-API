const db = require("../db/connection");

exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  if (rows.length === 0)
    return Promise.reject({ status: 204, msg: "there are no topics" });
  return rows;
};

exports.insertTopic = async (slug, description) => {
  const {
    rows: [topic],
  } = await db.query(
    `
    INSERT INTO topics
      (slug, description)
    VALUES
      ($1, $2)
    RETURNING *;
  `,
    [slug, description]
  );
  return topic;
};
