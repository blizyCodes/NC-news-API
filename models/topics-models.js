const db = require("../db/connection");

exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  if (rows.length === 0)
    return Promise.reject({ status: 204, msg: "there are no topics" });
  return rows;
};
