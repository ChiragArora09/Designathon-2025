const { execFile } = require("child_process");
const db = require("../config/db");

// CREATE BATCH AND GENERATE LEARNING PATH
async function createBatchesWithLearningPath(batchGroups) {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    for (const group of batchGroups) {
      const { name, skill, phase, topics, startDate, year, duration, batchCount } = group;

      // 1. Call Python script to generate plan
      const aiPlan = await new Promise((resolve, reject) => {
        execFile("C:/Users/Chirag Arora/AppData/Local/Programs/Python/Python311/python.exe", ["./ai/generate_training_path.py", skill, topics, String(duration), startDate], (err, stdout, stderr) => {
          if (err) return reject(err);
          try {
            const parsed = JSON.parse(stdout);
            resolve(parsed);
          } catch (e) {
            reject("Invalid JSON from Python");
          }
        });
      });

      // 2. Insert into learning_paths
      const [lpRes] = await conn.query(
        "INSERT INTO learning_paths (skill, created_at) VALUES (?, NOW())",
        [skill]
      );
      const learningPathId = lpRes.insertId;

      console.log(aiPlan)

      // 3. Insert topics + activities
      for (const topic of aiPlan.day_wise_plan) {
        const [topicRes] = await conn.query(
          "INSERT INTO learning_path_topics (path_id, day, topic_title, description, topic_date) VALUES (?, ?, ?, ?, ?)",
          [learningPathId, topic.day, topic.topic_title, topic.description, topic.date]
        );
        const topicId = topicRes.insertId;

        for (const online of topic.online_activities || []) {
          await conn.query(
            "INSERT INTO online_activities (topic_id, type, title, details, ai_generated) VALUES (?, ?, ?, ?, ?)",
            [topicId, online.type, online.title, online.details, true]
          );
        }

        for (const offline of topic.offline_activities || []) {
          await conn.query(
            "INSERT INTO offline_activities (topic_id, type, trainer_notes) VALUES (?, ?, ?)",
            [topicId, offline.type, offline.trainer_notes]
          );
        }
      }

      // 4. Insert multiple batches with same learning path
      for (let i = 1; i <= batchCount; i++) {
        const suffix = batchCount > 1 ? `_${i}` : "";
        const fullName = `${name}${suffix}`;

        await conn.query(
          `INSERT INTO batches (name, skill, phase, start_date, year, duration, path_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [fullName, skill, phase, startDate, year, duration, learningPathId]
        );
      }
    }

    await conn.commit();
    conn.release();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("❌ Error:", err.message);
    throw err;
  }
}


// GET all batches
const getAllBatches = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.id,
        b.name,
        b.skill,
        b.phase,
        b.start_date,
        b.year,
        b.duration,
        b.path_id
      FROM batches b
      ORDER BY b.start_date ASC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Failed to fetch batches:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// GET LEARNING PATH FOR BATCH
const getLearningPathForBatch = async (req, res) => {
  const batchId = req.params.id;
  try {
    // 1. Get learning path ID from batch
    const [batchRows] = await db.query(
      `SELECT path_id FROM batches WHERE id = ?`,
      [batchId]
    );

    if (batchRows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const pathId = batchRows[0].path_id;

    // 2. Get topics for the path
    const [topics] = await db.query(
      `SELECT id, day, topic_title, description, topic_date
       FROM learning_path_topics 
       WHERE path_id = ? 
       ORDER BY day`,
      [pathId]
    );

    // 3. For each topic, get activities
    const result = [];

    for (const topic of topics) {
      const [online] = await db.query(
        `SELECT type, title, details 
         FROM online_activities 
         WHERE topic_id = ?`,
        [topic.id]
      );

      const [offline] = await db.query(
        `SELECT type, trainer_notes 
         FROM offline_activities 
         WHERE topic_id = ?`,
        [topic.id]
      );

      result.push({
        day: topic.day,
        topic_title: topic.topic_title,
        description: topic.description,
        date: topic.topic_date,
        online_activities: online,
        offline_activities: offline
      });
    }

    res.json({ path_id: pathId, day_wise_plan: result });
  } catch (err) {
    console.error("❌ Error fetching learning path:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {createBatchesWithLearningPath, getAllBatches, getLearningPathForBatch}