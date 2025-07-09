// config/multer.js (or wherever you're initializing multer)
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // ensure folder exists
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    const timestamp = Date.now();
    const newName = `${baseName}_${timestamp}${ext}`;
    cb(null, newName);
  },
});

const upload = multer({ storage });

export default upload;
