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
  createLayout,
  deleteLayout,
  setDefaultLayout,
  getLayoutDetail,
  updateLayout,
  publishLayout,
  createLayoutTab,
  deleteLayoutTab,
  saveLayoutTabSections,
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
router.post("/objects/:objectId/layouts", createLayout);
router.delete("/objects/:objectId/layouts/:layoutId", deleteLayout);
router.patch("/objects/:objectId/layouts/:layoutId/default", setDefaultLayout);

router.get("/objects/:objectId/layouts/:layoutId", getLayoutDetail);
router.patch("/objects/:objectId/layouts/:layoutId", updateLayout);
router.post("/objects/:objectId/layouts/:layoutId/publish", publishLayout);

router.post("/objects/:objectId/layouts/:layoutId/tabs", createLayoutTab);
router.delete("/objects/:objectId/layouts/:layoutId/tabs/:tabId", deleteLayoutTab);
router.patch(
  "/objects/:objectId/layouts/:layoutId/tabs/:tabId/sections",
  saveLayoutTabSections,
);

export default router;
