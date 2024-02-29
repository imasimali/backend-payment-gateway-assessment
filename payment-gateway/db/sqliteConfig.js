const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./mydb.sqlite3", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to SQLite database.");
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerFullName TEXT,
      price REAL,
      currency TEXT,
      creditCardHolderName TEXT,
      creditCardNumber TEXT,
      creditCardExpiration TEXT,
      creditCardCCV TEXT,
      paymentGatewayUsed TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

module.exports = db;
