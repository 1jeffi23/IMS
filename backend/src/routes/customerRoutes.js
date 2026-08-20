import express from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,

} from "../controllers/customerController.js";

import {  requireAuth,
  requireRole,} from "../../middlewares/authMiddleware.js";


const router = express.Router();

// Customers
router.get(
  "/",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  getCustomers
);

router.get(
  "/:id",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  getCustomerById
);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager", "cashier"),
  createCustomer
);



export default router;