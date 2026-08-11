import express from "express";
import {
  getOrganizations,
  createOrganization,
  getCurrentOrganization,
  switchOrganization,
  getOrganizationById,
} from "../Controllers/orgController.js";

const router = express.Router();

router.get("/", getOrganizations);

router.post("/", createOrganization);

// Has to be registered before "/:id" or it would be read as an organisation id.
router.get("/current", getCurrentOrganization);

router.post("/:id/switch", switchOrganization);

router.get("/:id", getOrganizationById);

export default router;
