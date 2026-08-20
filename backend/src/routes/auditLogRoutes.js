import express from "express";

import {
  getAuditLogs,
  getUserAuditLogs,
} from "../controllers/auditLogController.js";

import {
  requireAuth,
  requireRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();


// ==========================================
// GET ALL AUDIT LOGS
// ADMIN ONLY
// ==========================================

router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  getAuditLogs
);


// ==========================================
// GET SPECIFIC USER HISTORY
// ADMIN ONLY
// ==========================================

router.get(
  "/user/:userId",
  requireAuth,
  requireRole("admin"),
  getUserAuditLogs
);


export default router;