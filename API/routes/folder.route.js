import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
  renameFolder,
  searchFolders,
} from "../controllers/folder.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = Router();

// Search for folder by name
router.get("/search/:query", verifyToken, searchFolders);

// Get all folders (optionally by parentId or by root folder)
router.get("/:id", verifyToken, getFolders);

// Rename folder
router.put("/rename/:id", verifyToken, renameFolder);

// Create a new folder
router.post("/create", verifyToken, createFolder);

// Delete a folder
router.delete("/:id", verifyToken, deleteFolder);

export default router;
