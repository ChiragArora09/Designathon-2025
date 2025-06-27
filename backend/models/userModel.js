const db = require('../config/db');

exports.createUser = (username, password_hash, callback) => {
  const query = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  db.query(query, [username, password_hash], callback);
};
