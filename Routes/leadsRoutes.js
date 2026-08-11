import express from "express";
import { getLeads, createLead, getLeadById, updateLead } from "../Controllers/leadsController.js";

const router = express.Router();

router.get("/", getLeads);

router.post("/", createLead);

router.get("/:id", getLeadById);

router.patch("/:id", updateLead);




export default router;