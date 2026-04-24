import express from "express";
import mysql from "mysql2";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary config done");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  db.query("SELECT * FROM author", (err, result) => {
    if (err) {
      console.error(err);
      return res.send("DB error");
    }

    res.json(result);
  });
});

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const imageUrl = req.file.path;

    res.json({
      message: "Upload success",
      url: imageUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* =========================
   Upload + Save to MySQL
========================= */

app.post("/upload-author", upload.single("image"), (req, res) => {
  const { name } = req.body;

  const imageUrl = req.file.path;

  const sql = "INSERT INTO author (name, image_url) VALUES (?, ?)";

  db.query(sql, [name, imageUrl], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "DB insert error",
      });
    }

    res.json({
      message: "Author created",
      image: imageUrl,
    });
  });
});

app.listen(process.env.PORT || 3000);
