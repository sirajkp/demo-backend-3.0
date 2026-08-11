import express from "express";
import {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../Controllers/contactsController.js";

const router = express.Router();

router.get("/", getContacts);

router.post("/", createContact);

router.get("/:id", getContactById);

router.patch("/:id", updateContact);

router.delete("/:id", deleteContact);

export default router;
