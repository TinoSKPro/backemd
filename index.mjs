import express from "express";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const form = new FormData();
    form.append("file", new Blob([file.buffer]), file.originalname);

    const response = await fetch("https://api.gofile.io/uploadFile", {
      method: "POST",
      body: form
    });

    const data = await response.json();
    const link = data.data.downloadPage;

    res.json({ link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload_failed" });
  }
});

// *** TOTO JE KRITICKÉ PRE RENDER ***
app.listen(process.env.PORT || 10000, () => console.log("Server running"));
