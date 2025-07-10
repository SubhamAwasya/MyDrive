import fs from "fs";
import path from "path";
import File from "../models/file.model.js";

export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, size, filename } = req.file;
    const parentFolder = req.body.parentFolder;
    const extension = path.extname(originalname).replace(".", "");
    const baseName = path.basename(originalname, path.extname(originalname));

    // This assumes express.static("uploads") is configured in app.js
    const fileUrl = `uploads/${filename}`;

    const fileDoc = new File({
      name: baseName,
      type: extension,
      size,
      url: fileUrl,
      parentFolder: parentFolder || null,
      user: req.user.userId,
    });

    const savedFile = await fileDoc.save();
    res.status(201).json(savedFile);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
}

export async function getAllFiles(req, res) {
  const { folderId } = req.params;

  try {
    const files = await File.find({ parentFolder: folderId }).sort({
      createdAt: -1,
    });

    res.status(200).json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
}

export async function deleteFile(req, res) {
  const { fileId } = req.params;

  try {
    const deletedFile = await File.findByIdAndDelete(fileId);

    if (!deletedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    // Build the absolute path to the file
    const filePath = path.resolve(
      "public/uploads",
      deletedFile.url.split("/").pop()
    );

    // Check if the file exists before trying to delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn("File not found on disk:", filePath);
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
}

export async function renameFile(req, res) {
  const { id, newName } = req.body;

  try {
    const updatedFile = await File.findByIdAndUpdate(
      id,
      { name: newName },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({ message: "File renamed successfully" });
  } catch (err) {
    console.error("Error renaming file:", err);
    res.status(500).json({ error: "Failed to rename file" });
  }
}

export async function searchFiles(req, res) {
  const { query } = req.params;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Search query is required." });
  }

  try {
    const results = await File.find({
      user: req.user.userId,
      name: { $regex: query, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json(results);
  } catch (err) {
    console.error("Error searching files:", err);
    res.status(500).json({ error: "Failed to search files" });
  }
}
