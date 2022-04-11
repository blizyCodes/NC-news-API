const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query("SELECT username FROM users;");
  if (rows.length === 0)
    return Promise.reject({ status: 204, msg: "There are no users." });
  return rows;
};

exports.selectUserByUsername = async (username) => {
  const {
    rows: [user],
  } = await db.query(
    "SELECT username, avatar_url, name FROM users WHERE username = $1;",
    [username]
  );
  if (!user)
    return Promise.reject({
      status: 404,
      msg: "No user found.",
    });
  return user;
};
