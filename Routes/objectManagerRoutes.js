import express from "express";
import {
  getObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getAssociations,
  createAssociation,
  deleteAssociation,
  getLayouts,
} from "../Controllers/objectManagerController.js";

const router = express.Router();

router.get("/objects", getObjects);
router.post("/objects", createObject);
router.get("/objects/:objectId", getObjectById);
router.patch("/objects/:objectId", updateObject);
router.delete("/objects/:objectId", deleteObject);

router.get("/objects/:objectId/properties", getProperties);
router.post("/objects/:objectId/properties", createProperty);
router.patch("/objects/:objectId/properties/:propertyId", updateProperty);
router.delete("/objects/:objectId/properties/:propertyId", deleteProperty);

router.get("/objects/:objectId/associations", getAssociations);
router.post("/objects/:objectId/associations", createAssociation);
router.delete("/objects/:objectId/associations/:associationId", deleteAssociation);

router.get("/objects/:objectId/layouts", getLayouts);

export default router;
