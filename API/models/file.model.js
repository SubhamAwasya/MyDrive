import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
export default File;
