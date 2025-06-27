const db = require('./config/db');

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        role ENUM('maverick', 'Admin') DEFAULT 'maverick',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS mavericks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(15),
        role VARCHAR(100),
        year INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS learning_paths (
        id INT AUTO_INCREMENT PRIMARY KEY,
        skill VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS learning_path_topics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        path_id INT,
        day INT,
        topic_date DATE,
        topic_title VARCHAR(255),
        description TEXT,
        FOREIGN KEY (path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS online_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic_id INT,
        type ENUM('quiz', 'coding'),
        title VARCHAR(255),
        details TEXT,
        ai_generated BOOLEAN DEFAULT true,
        FOREIGN KEY (topic_id) REFERENCES learning_path_topics(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS offline_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic_id INT,
        type ENUM('lecture', 'assignment'),
        trainer_notes TEXT,
        FOREIGN KEY (topic_id) REFERENCES learning_path_topics(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        skill VARCHAR(100),
        phase ENUM('Phase 1 - Softskills', 'Phase 1 - Technical', 'Phase 2 - Softskills', 'Phase 2 - Role-specific'),
        start_date DATE,
        year INT,
        duration INT,
        path_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (path_id) REFERENCES learning_paths(id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS maverick_batch (
        id INT AUTO_INCREMENT PRIMARY KEY,
        maverick_id INT,
        batch_id INT,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        phase_type ENUM('Phase 1 - Softskills', 'Phase 1 - Technical', 'Phase 2 - Softskills', 'Phase 2 - Role-specific'),
        FOREIGN KEY (maverick_id) REFERENCES mavericks(id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
    process.exit(1);
  }
};

createTables();