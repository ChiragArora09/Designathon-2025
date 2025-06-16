const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// changes in user table
// separate tables (users, mavericks)
// batches, name, course, starting date, ending date, trainer's name,

// 300 students onboarded 

/*
250 react, 50 testing
5           2
-1). if 300 students are selected = 10 batches batch
react 5
testing 3

batch
1 1 react trainer 30 2024 soft_skils1 starting-date year time 

m_id b_id
  1    1 
  1    2

1). maverick/admim = login (user table)
ADMIN:
CSV upload = data will go in maverick table
case study



*/

// 1 - soft skills

const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('maverick', 'Admin') DEFAULT 'maverick',
  department VARCHAR(100),
  skill VARCHAR(100),
  experience_level ENUM('maverick', 'Intern', 'Lateral'),
  status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
  joined_on DATE,
  profile_photo TEXT,
);

CREATE TABLE IF NOT EXISTS learning_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT,
  plan_json JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maverick_id INT,
  topic VARCHAR(100),
  difficulty ENUM('Easy', 'Medium', 'Hard'),
  status ENUM('Assigned', 'Started', 'Submitted', 'Expired') DEFAULT 'Assigned',
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT,
  question TEXT,
  options JSON,
  correct_option VARCHAR(5),
  FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT,
  question_id INT,
  selected_option VARCHAR(5),
  is_correct BOOLEAN,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coding_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maverick_id INT,
  challenge_name VARCHAR(100),
  score FLOAT,
  status ENUM('Pending', 'In Progress', 'Completed'),
  submitted_at DATETIME,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maverick_id INT,
  topic VARCHAR(100),
  status ENUM('Assigned', 'Submitted', 'Graded'),
  score FLOAT,
  submitted_at DATETIME,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maverick_id INT,
  name VARCHAR(100),
  status ENUM('In Progress', 'Completed', 'Failed'),
  completed_on DATE,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maverick_id INT,
  report_type ENUM('Progress', 'Final', 'Custom'),
  generated_by VARCHAR(50),
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  content TEXT,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maverick_id INT,
  type ENUM('visit', 'ping', 'idle', 'exit'),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maverick_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

// image in certifications

connection.query(createTables, (err, result) => {
  if (err) {
    console.error("Error creating tables:", err.message);
  } else {
    console.log("✅ Tables created successfully");
  }
  connection.end();
});