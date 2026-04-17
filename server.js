import express from "express";
import mysql from "mysql2";

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.send("DB error");
    res.send("API running");
  });

});

app.listen(process.env.PORT || 3000);
