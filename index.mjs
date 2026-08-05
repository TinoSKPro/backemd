import express from "express";
import multer from "multer";
import cors from "cors";
import fetch, { FormData, Blob } from "node-fetch";

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const form = new FormData();
    form.append("file", new Blob([file.buffer]), file.originalname);

    // 1️⃣ Upload file
    const uploadRes = await fetch("https://upload.gofile.io/uploadfile", {
      method: "POST",
      body: form
    });

    const uploadData = await uploadRes.json();
    const contentId = uploadData?.data?.contentId;

    if (!contentId) {
      return res.json({ link: null });
    }

    // 2️⃣ Create direct download link
    const directRes = await fetch(`https://api.gofile.io/contents/${contentId}/directlinks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    const directData = await directRes.json();
    const directLink = directData?.data?.directLink;

    res.json({ link: directLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ link: null });
  }
});

app.listen(process.env.PORT || 10000);
