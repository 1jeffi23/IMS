import express from "express";

import {
  createPurchase,
  getPurchases,
  getPurchaseById,
} from "../controllers/purchaseController.js";

import { requireAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();


// Create Purchase
router.post(
  "/",
  requireAuth,
  createPurchase
);


// Get All Purchases
router.get(
  "/",
//   requireAuth,
  getPurchases
);


// Get Single Purchase
router.get(
  "/:id",
//   requireAuth,
  getPurchaseById
);


export default router;