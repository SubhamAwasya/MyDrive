import { Router } from "express";

import { login } from "../controllers/user.controller.js";
import { register } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/jwt.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", verifyToken, getCurrentUser);

export default router;
