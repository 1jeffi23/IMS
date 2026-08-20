import express from "express";

import {
  getUsers,
  updateUserRole,
} from "../controllers/userController.js";

import {
  requireAuth,
  requireRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  getUsers
);

router.patch("/:id/role", 
  requireAuth,
  requireRole("admin"),
  updateUserRole);

export default router;