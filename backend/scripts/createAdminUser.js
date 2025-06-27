#!/usr/bin/env node

const bcrypt = require("bcrypt");
const db = require("../config/db");

// Get CLI arguments
const args = process.argv.slice(2);
const [username, password] = args;

if (!username || !password) {
  console.log("❌ Usage: node scripts/createAdminUser.js <username> <password>");
  process.exit(1);
}

const createAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, password_hash, role)
      VALUES (?, ?, 'Admin')
    `;

    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.error("⚠️  Username already exists.");
        } else {
          console.error("❌ Error inserting admin:", err.message);
        }
      } else {
        console.log(`✅ Admin '${username}' created with ID: ${result.insertId}`);
      }
      process.exit();
    });
  } catch (err) {
    console.error("❌ Error hashing password:", err.message);
    process.exit(1);
  }
};

createAdminUser();