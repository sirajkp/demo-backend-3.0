import express from "express";
import { getUsers, getUsersById } from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUsersById);

export default router;