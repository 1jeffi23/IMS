
import express from 'express';
import {
  requireAuth,
  requireRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/test-auth", requireAuth, (req, res) => {
  res.json({
    message: "Authenticated user",
    user: req.user,
  });
});

router.get(
  "/test-admin",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

export default router;