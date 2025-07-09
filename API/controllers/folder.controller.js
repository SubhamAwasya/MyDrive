import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";

export async function createFolder(req, res) {
  try {
    if (!req.body?.name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    let parentFolder;

    if (req.body.parentFolder) {
      parentFolder = req.body.parentFolder;
    } else {
      parentFolder = req.user.rootFolder;
    }

    const folder = await Folder.create({
      name: req.body.name,
      parentFolder,
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller to fetch child folders of a given parent folder
export async function getFolders(req, res) {
  try {
    // Extract folder ID from URL params or fallback to user's root folder
    const folderId = req.params.id || req.user.rootFolder;

    // Validate folder ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      console.log({ error: "Invalid folder ID format" });
      return res.status(404).json({ error: "No folders found" });
    }

    // Fetch child folders of the given parent folder
    const folders = await Folder.find({ parentFolder: folderId });

    // Optional: If you want to handle empty result
    if (!folders) {
      return res.status(404).json({ error: "No folders found" });
    }

    // Send the folders as a response
    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 🔁 Recursive helper to delete a folder, its subfolders, and files
async function deleteFolderRecursively(folderId) {
  // 1. Delete all files in this folder (from DB and disk)
  const files = await File.find({ parentFolder: folderId });

  for (const file of files) {
    const filePath = path.resolve("public/uploads", file.url.split("/").pop());

    // Remove from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from DB
    await File.findByIdAndDelete(file._id);
  }

  // 2. Find and delete subfolders recursively
  const children = await Folder.find({ parentFolder: folderId });
  for (const child of children) {
    await deleteFolderRecursively(child._id);
  }

  // 3. Delete the current folder itself
  await Folder.findByIdAndDelete(folderId);
}

// 📦 Controller
export async function deleteFolder(req, res) {
  try {
    const folderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ error: "Invalid folder ID" });
    }

    const folderExists = await Folder.findById(folderId);
    if (!folderExists) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Perform recursive deletion
    await deleteFolderRecursively(folderId);

    res
      .status(200)
      .json({ message: "Folder, subfolders, and files deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete folder and contents" });
  }
}

export async function renameFolder(req, res) {
  try {
    const folderId = req.params.id;
    const newName = req.body.newName;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ error: "Invalid folder ID" });
    }

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ error: "New folder name is required" });
    }

    const updated = await Folder.findByIdAndUpdate(
      folderId,
      { name: newName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
