const db = require('../config/db');

exports.createMaverick = (student, user_id, callback) => {
  const query = `
    INSERT INTO mavericks (full_name, email, phone, year, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    student.full_name,
    student.email,
    student.phone,
    student.year,
    user_id
  ], callback);
};
