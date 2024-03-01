const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

const db = new sqlite3.Database("./mydb.sqlite3", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to SQLite database.");
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      amount TEXT NOT NULL,
      currency TEXT NOT NULL,
      credit_card_number TEXT NOT NULL,
      payment_gateway TEXT NOT NULL,
      transaction_id TEXT,
      success BOOLEAN NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP  
    )`);
  }
});

// Convert db.run to support Promises
const dbRun = promisify(db.run.bind(db));

module.exports = { db, dbRun };
