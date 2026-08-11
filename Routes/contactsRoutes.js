import express from "express";
import {
  getContacts,
  createContact,
  importContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../Controllers/contactsController.js";

const router = express.Router();

router.get("/", getContacts);

router.post("/", createContact);

// Registered before "/:id" so "import" isn't taken for a contact id.
router.post("/import", importContacts);

router.get("/:id", getContactById);

router.patch("/:id", updateContact);

router.delete("/:id", deleteContact);

export default router;
