import crypto from "crypto";
import { db } from "../db/index.js";
import { auditLog } from "../src/models/auditLogModel.js";

export const createAuditLog = async ({
  userId,
  action,
  module,
  entityId = null,
  description,
}) => {
  try {
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      userId,
      action,
      module,
      entityId,
      description,
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
};