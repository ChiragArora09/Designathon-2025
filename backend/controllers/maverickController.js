const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const bcrypt = require('bcrypt');
const db = require('../config/db')

// Util: Generate secure password
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Util: Create a unique username (e.g., priya.sharma02)
const generateUsername = async (name) => {
  let base = name.trim().toLowerCase().replace(/\s+/g, '.');
  let username = base;
  let count = 1;

  const [existing] = await db.query('SELECT username FROM users WHERE username LIKE ?', [`${base}%`]);
  const usernames = new Set(existing.map(u => u.username));

  while (usernames.has(username)) {
    username = `${base}${String(count).padStart(2, '0')}`;
    count++;
  }
  return username;
};

// Add Mavericks from csv file
exports.importMavericks =  async (req, res) => {
  const mavericks = req.body.data;

  if (!Array.isArray(mavericks)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const results = [];

    for (const m of mavericks) {
      const username = await generateUsername(m.name);
      const plainPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Insert into users
      const [userRes] = await db.query(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [username, hashedPassword, 'Maverick']
      );

      const userId = userRes.insertId;

      // Insert into mavericks
      await db.query(
        'INSERT INTO mavericks (user_id, full_name, email, phone, year, role) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, m.name, m.email, m.phone, m.year, m.role]
      );

      results.push({ username, password: plainPassword, name: m.name, email: m.email });
    }
    const parser = new Parser({ fields: ['username', 'password', 'name', 'email'] });
    const csv = parser.parse(results);

    const filePath = path.join(__dirname, '../tmp/credentials.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'credentials.csv', () => {
      fs.unlinkSync(filePath); // Cleanup after download
    });

    // res.json({ success: true, imported: results });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Server error during import' });
  }
};

// Add one Maverick
exports.addMaverick = async (req, res) => {
  const { name, email, skill, phone, year } = req.body;

  if (!name || !email || !phone || !skill || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const username = await generateUsername(name);
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [userRes] = await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'Maverick']
    );

    const userId = userRes.insertId;

    await db.query(
      'INSERT INTO mavericks (user_id) VALUES (?)',
      [userId]
    );

    const credentials = [
      { Name: name, Username: username, Password: plainPassword, Email: email }
    ];

    const parser = new Parser({ fields: ['Name', 'Username', 'Password', 'Email'] });
    const csv = parser.parse(credentials);

    const filePath = path.join(__dirname, '../tmp/manual_credentials.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'credentials.csv', () => {
      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error("❌ Manual import error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
// id = select m.id from maverick_batch where batch_type="phase 1 - segue soft_skill"
exports.getUnassignedMavericks = async (req, res) => {
  try {
    const { phaseType } = req.query;
    console.log(phaseType)
    let previousPhase = "";

    if(phaseType=="Phase 1 - Softskills"){
      const [rows] = await db.query(`SELECT id, full_name, role, year FROM mavericks m WHERE id NOT IN (select maverick_id from maverick_batch)`);
      res.json(rows)
    }else if(phaseType=="Phase 1 - Technical"){
      previousPhase = "Phase 1 - Softskills"
    }else if(phaseType=="Phase 2 - Softskills"){
      previousPhase = "Phase 1 - Technical"
    }else{
      previousPhase = "Phase 2 - Softskills"
    }
    console.log(previousPhase);
    const [rows] = await db.query(`
      SELECT id, full_name, role, year FROM mavericks m WHERE id in (select maverick_id from maverick_batch where phase_type=? AND maverick_id NOT IN (select maverick_id from maverick_batch where phase_type=?))`,[previousPhase, phaseType]);
      res.json(rows)
  } catch (err) {
    console.error("❌ Failed to fetch unassigned mavericks:", err);
    res.status(500).json({ error: "Server error" });
  }
}
