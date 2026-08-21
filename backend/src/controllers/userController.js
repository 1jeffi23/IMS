import { db } from "../../db/index.js";
import { user } from "../models/authModel.js";
import { eq, desc } from "drizzle-orm";

import { createAuditLog } from "../../utils/auditLogger.js";

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

export const getUsers = async (req, res) => {
  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });

  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};


// =====================================================
// UPDATE USER ROLE
// ADMIN ONLY
// =====================================================

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

  
    // VALIDATION
  

    if (!["admin", "manager", "cashier"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

  
    // FIND USER
  

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

  
    // NO CHANGE
  

    if (existingUser.role === role) {
      return res.status(400).json({
        message: "User already has this role",
      });
    }

    const oldRole = existingUser.role;

  
    // UPDATE ROLE
  

    const [updatedUser] = await db
      .update(user)
      .set({
        role,
      })
      .where(eq(user.id, userId))
      .returning();

  
    // AUDIT LOG
  

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE",
      module: "USER",
      entityId: String(userId),
      description:
        `Changed role of ${existingUser.name} from ${oldRole} to ${role}`,
    });

  
    // RESPONSE
  

    return res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      message: "Failed to update user role",
    });
  }
};