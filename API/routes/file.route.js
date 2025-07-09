import { Router } from "express";

import {
  deleteFile,
  getAllFiles,
  renameFile,
  uploadFile,
} from "../controllers/file.controller.js";

import { verifyToken } from "../middleware/jwt.js";

import upload from "../middleware/multer.js";

const router = Router();

// Upload a file
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// Get all files (optionally by folderId or userId)
router.get("/all/:folderId", verifyToken, getAllFiles);

// Delete a file
router.delete("/:fileId", verifyToken, deleteFile);

// Rename a file
router.put("/rename", verifyToken, renameFile);

export default router;
