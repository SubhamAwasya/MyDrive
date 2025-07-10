import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
