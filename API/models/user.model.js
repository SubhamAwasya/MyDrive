import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    avatar: {
      type: String, // URL or Cloudinary ID
      default: "",
    },
    rootFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: [true, "Root folder is required"],
    },
    driveMaxSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10 MB
    },
    driveUsedSize: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
