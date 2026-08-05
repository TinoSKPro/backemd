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

    // Correct GoFile upload endpoint from your document
    const response = await fetch("https://upload.gofile.io/uploadfile", {
      method: "POST",
      body: form
    });

    const data = await response.json();

    // GoFile returns link inside data.data.downloadPage
    const link = data?.data?.downloadPage;

    res.json({ link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ link: null });
  }
});

app.listen(process.env.PORT || 10000);
