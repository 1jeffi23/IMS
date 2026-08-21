import { db } from "../../db/index.js";
import { auditLog } from "../models/auditLogModel.js";
import { user } from "../models/authModel.js";
import { eq, desc } from "drizzle-orm";


// GET ALL AUDIT LOGS

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await db
      .select({
        id: auditLog.id,
        userId: auditLog.userId,
        userName: user.name,
        userEmail: user.email,
        action: auditLog.action,
        module: auditLog.module,
        entityId: auditLog.entityId,
        description: auditLog.description,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .leftJoin(user, eq(auditLog.userId, user.id))
      .orderBy(desc(auditLog.createdAt));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Get audit logs error:", error);

    res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};



// GET AUDIT LOGS OF SPECIFIC USER


export const getUserAuditLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await db
      .select({
        id: auditLog.id,
        userId: auditLog.userId,
        userName: user.name,
        userEmail: user.email,
        action: auditLog.action,
        module: auditLog.module,
        entityId: auditLog.entityId,
        description: auditLog.description,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .leftJoin(user, eq(auditLog.userId, user.id))
      .where(eq(auditLog.userId, userId))
      .orderBy(desc(auditLog.createdAt));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Get user audit logs error:", error);

    res.status(500).json({
      message: "Failed to fetch user audit logs",
    });
  }
};