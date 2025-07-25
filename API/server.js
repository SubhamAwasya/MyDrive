import cors from "cors";
import express from "express";

import userRouter from "./routes/user.route.js";
import fileRouter from "./routes/file.route.js";
import folderRouter from "./routes/folder.route.js";

import "./db/db.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Print req route
app.use((req, res, next) => {
  console.log({ url: req.url, method: req.method });
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.log(err.message);
  next();
});

app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

// Print req body

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
