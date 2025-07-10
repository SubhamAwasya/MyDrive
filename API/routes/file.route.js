import { Router } from "express";

import {
  deleteFile,
  getAllFiles,
  renameFile,
  searchFiles,
  uploadFile,
} from "../controllers/file.controller.js";

import { verifyToken } from "../middleware/jwt.js";

import upload from "../middleware/multer.js";

const router = Router();

// Search for files by name
router.get("/search/:query", verifyToken, searchFiles);

// Get all files (optionally by folderId or userId)
router.get("/all/:folderId", verifyToken, getAllFiles);

// Rename a file
router.put("/rename", verifyToken, renameFile);

// Upload a file
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// Delete a file
router.delete("/:fileId", verifyToken, deleteFile);

export default router;
