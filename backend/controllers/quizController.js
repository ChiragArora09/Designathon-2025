const { execFile } = require("child_process");
const db = require("../config/db");

exports.generateQuizQuestions = async (req, res) => {
  try {
    const { maverickId, activityId, topicTitle, activity_type } = req.body;
    console.log("ActivityID:", activityId)

    // Run Python script to get AI-generated quiz questions
    const python = execFile("C:/Users/Chirag Arora/AppData/Local/Programs/Python/Python311/python.exe", ['./ai/generate_quiz_questions.py', topicTitle, activity_type],
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Python error:", stderr);
          return res.status(500).json({ error: "Quiz generation failed." });
        }

        const quizData = JSON.parse(stdout);
        console.log("✅ Quiz Questions:", quizData);

        // Insert new maverick_activities record
        db.query(
          `INSERT INTO maverick_activities (maverick_id, activity_id, activity_type, activity_title, completed, answers_json)
           VALUES (?, ?, 'quiz', ?, 0, ?)`,
          [maverickId, activityId, topicTitle, JSON.stringify(quizData)],
          (err, result) => {
            if (err) {
              console.error("❌ DB Insert error:", err);
              return res.status(500).json({ error: "Failed to save activity." });
            }

            res.json({
              activityId: result.insertId,
              questions: quizData.questions
            });
          }
        );
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};


exports.submitQuiz = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { activityId, answers } = req.body;

    let correctCount = 0;

    await conn.beginTransaction();

    // Save each answer
    for (const answer of answers) {
      const isCorrect = answer.user_answer.trim().toLowerCase() === answer.correct_answer.trim().toLowerCase() ? 1 : 0;
      correctCount += isCorrect;

      await conn.query(
        `INSERT INTO maverick_activity_answers
         (maverick_activity_id, question, correct_answer, user_answer, is_correct)
         VALUES (?, ?, ?, ?, ?)`,
        [activityId, answer.question, answer.correct_answer, answer.user_answer, isCorrect]
      );
    }

    const score = (correctCount / answers.length) * 100;

    // Update main activity
    await conn.query(
      `UPDATE maverick_activities
       SET completed = 1, score = ?, submitted_at = NOW()
       WHERE id = ?`,
      [score, activityId]
    );

    await conn.commit();
    conn.release();

    res.json({ message: "✅ Quiz submitted!", score });

  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("❌ Submit Quiz Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
