import express from "express";
import {
  getForms,
  getFormById,
  createForm,
  updateForm,
  publishForm,
  unpublishForm,
  deleteForm,
} from "../Controllers/formsController.js";

const router = express.Router();

router.get("/", getForms);

router.post("/", createForm);

router.get("/:formId", getFormById);

router.patch("/:formId", updateForm);

router.post("/:formId/publish", publishForm);

router.post("/:formId/unpublish", unpublishForm);

router.delete("/:formId", deleteForm);

export default router;
