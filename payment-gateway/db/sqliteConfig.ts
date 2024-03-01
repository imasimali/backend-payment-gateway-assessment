import sqlite3 from "sqlite3";

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

const dbRun = (sql: string, params: any[]): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export { db, dbRun };
