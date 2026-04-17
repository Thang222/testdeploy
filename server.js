import express from "express";
import mysql from "mysql2";

const app = express();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

app.get("/", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.send("DB error");
    res.send("API running");
  });

});

app.listen(process.env.PORT || 3000);
