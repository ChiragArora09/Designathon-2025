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

exports.getUnassignedMavericks = async (req, res) => {
  try {
    const { phaseType } = req.query;
    console.log(phaseType)
    let previousPhase = "";

    if(phaseType=="Phase 1 - Softskills"){
      const [rows] = await db.query(`SELECT id, full_name, role, year FROM mavericks m WHERE id NOT IN (select maverick_id from maverick_batch)`);
      return res.json(rows)
    }else if(phaseType=="Phase 1 - Technical"){
      previousPhase = "Phase 1 - Softskills"
    }else if(phaseType=="Phase 2 - Softskills"){
      previousPhase = "Phase 1 - Technical"
    }else{
      previousPhase = "Phase 2 - Softskills"
    }
    console.log(previousPhase);
    const [rows] = await db.query(`
      SELECT m.id, m.full_name, m.role, m.year
      FROM mavericks m
      WHERE m.id IN (
        SELECT mb1.maverick_id 
        FROM maverick_batch mb1 
        WHERE mb1.phase_type = ?
      )
      AND m.id NOT IN (
        SELECT mb2.maverick_id 
        FROM maverick_batch mb2 
        WHERE mb2.phase_type = ?
      )
    `, [previousPhase, phaseType]);
      return res.json(rows)
  } catch (err) {
    console.error("❌ Failed to fetch unassigned mavericks:", err);
    res.status(500).json({ error: "Server error" });
  }
}

exports.getMaverickProfile = async (req, res) => {
  const userId = req.session.userId;

  const [rows] = await db.query(`
    SELECT m.id, m.full_name, b.phase as phase_type, b.name as batch_name
    FROM mavericks m 
    JOIN maverick_batch mb ON mb.maverick_id = m.id 
    JOIN batches b ON b.id = mb.batch_id 
    WHERE m.user_id = ? 
    ORDER BY mb.assigned_at DESC LIMIT 1
  `, [userId]);

  res.json(rows[0]);
};

exports.getTodayPlan = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  // This assumes you track day-wise progress:
  const [todayRow] = await db.query(` 
    SELECT *
    FROM learning_path_topics
    WHERE path_id = (
      SELECT b.path_id 
      FROM batches b
      JOIN maverick_batch mb ON mb.batch_id = b.id
      WHERE mb.maverick_id = 1
    )
    AND day = (
      SELECT DATEDIFF(CURDATE(), mb.training_start_date) + 1
      FROM maverick_batch mb
      WHERE mb.maverick_id = 1
    );
  `, [id, id]);

  if (!todayRow.length) return res.json({});

  // Add activities
  const [online] = await db.query(`SELECT * FROM online_activities WHERE topic_id = ?`, [todayRow[0].id]);
  const [offline] = await db.query(`SELECT * FROM offline_activities WHERE topic_id = ?`, [todayRow[0].id]);

  res.json({
    ...todayRow[0],
    online_activities: online,
    offline_activities: offline
  });
}

exports.getMaverickLearningPath = async (req, res) => {
  try {
    const maverickId = req.params.id;

    // 1️⃣ Get the learning path ID for the maverick's batch
    const [batchRow] = await db.query(
      `SELECT b.path_id 
       FROM batches b
       JOIN maverick_batch mb ON mb.batch_id = b.id
       WHERE mb.maverick_id = ?`,
      [maverickId]
    );

    if (!batchRow[0]) {
      return res.status(404).json({ error: "No batch assigned" });
    }

    const pathId = batchRow[0].path_id;

    // 2️⃣ Get the day-wise topics
    const [topics] = await db.query(
      `SELECT id, day, topic_title, description 
       FROM learning_path_topics
       WHERE path_id = ?
       ORDER BY day ASC`,
      [pathId]
    );

    // 3️⃣ For each topic, get activities + completion status + score
    const day_wise_plan = await Promise.all(
      topics.map(async (topic) => {
        // ✅ Online Activities with maverick status
        const [online] = await db.query(
          `
            SELECT 
              oa.id,
              oa.type,
              oa.title,
              oa.details,
              IFNULL(ma.completed, FALSE) AS completed,
              ma.score
            FROM online_activities oa
            LEFT JOIN maverick_activities ma 
              ON ma.activity_id = oa.id AND ma.activity_type = 'online' AND ma.maverick_id = ?
            WHERE oa.topic_id = ?
          `,
          [maverickId, topic.id]
        );

        // ✅ Offline Activities with maverick status
        const [offline] = await db.query(
          `
            SELECT 
              oa.id,
              oa.type,
              oa.trainer_notes,
              IFNULL(ma.completed, FALSE) AS completed,
              ma.score
            FROM offline_activities oa
            LEFT JOIN maverick_activities ma 
              ON ma.activity_id = oa.id AND ma.activity_type = 'offline' AND ma.maverick_id = ?
            WHERE oa.topic_id = ?
          `,
          [maverickId, topic.id]
        );

        return {
          day: topic.day,
          topic_title: topic.topic_title,
          description: topic.description,
          online_activities: online,
          offline_activities: offline,
        };
      })
    );

    res.json({ day_wise_plan });
  } catch (err) {
    console.error("❌ Error fetching learning path:", err);
    res.status(500).json({ error: "Server error" });
  }
};