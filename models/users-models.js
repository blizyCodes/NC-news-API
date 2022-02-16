const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query("SELECT username FROM users");
  if (rows.length === 0)
    return Promise.reject({ status: 204, msg: "there are no users" });
  return rows;
};
