import express from "express";
import {
  getEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  previewEmailTemplate,
} from "../Controllers/emailTemplatesController.js";

const router = express.Router();

router.get("/", getEmailTemplates);

router.post("/", createEmailTemplate);

router.get("/:templateId", getEmailTemplateById);

router.patch("/:templateId", updateEmailTemplate);

router.delete("/:templateId", deleteEmailTemplate);

router.post("/:templateId/preview", previewEmailTemplate);

export default router;
