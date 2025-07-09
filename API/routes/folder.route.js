import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
  renameFolder,
} from "../controllers/folder.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = Router();

// Create a new folder
router.post("/create", verifyToken, createFolder);

// Rename folder
router.put("/rename/:id", verifyToken, renameFolder);

// Get all folders (optionally by parentId or by root folder)
router.get("/:id", verifyToken, getFolders);

// Delete a folder
router.delete("/:id", verifyToken, deleteFolder);

export default router;
