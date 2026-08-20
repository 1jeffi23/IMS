import { db } from "../../db/index.js";
import { customer } from "../models/customerModel.js";

import { eq } from "drizzle-orm";
import { createAuditLog } from "../../utils/auditLogger.js";


// =====================================================
// CREATE CUSTOMER
// =====================================================

export const createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
    } = req.body;

    // Validation
    if (!name?.trim()) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    // Create customer
    const [newCustomer] = await db
      .insert(customer)
      .values({
        name: name.trim(),

        phone:
          phone?.trim() || null,

        email:
          email?.trim() || null,
      })
      .returning();

    // AUDIT LOG
    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      module: "CUSTOMER",
      entityId: String(newCustomer.id),
      description: `Created customer ${newCustomer.name}`,
    });

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });

  } catch (error) {
    console.error(
      "Create customer error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create customer",
    });
  }
};


// =====================================================
// GET CUSTOMERS
// NO AUDIT LOG
// =====================================================

export const getCustomers = async (req, res) => {
  try {
    const customers = await db
      .select()
      .from(customer)
      .orderBy(customer.name);

    return res.status(200).json({
      message: "Customers fetched successfully",
      customers,
    });

  } catch (error) {
    console.error(
      "Get customers error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};


// =====================================================
// GET CUSTOMER BY ID
// NO AUDIT LOG
// =====================================================

export const getCustomerById = async (
  req,
  res
) => {
  try {
    const customerId =
      Number(req.params.id);

    if (Number.isNaN(customerId)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const [existingCustomer] =
      await db
        .select()
        .from(customer)
        .where(
          eq(
            customer.id,
            customerId
          )
        );

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      message: "Customer fetched successfully",
      customer: existingCustomer,
    });

  } catch (error) {
    console.error(
      "Get customer error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
};


// =====================================================
// UPDATE CUSTOMER
// =====================================================

export const updateCustomer = async (req, res) => {
  try {
    const customerId =
      Number(req.params.id);

    if (Number.isNaN(customerId)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const {
      name,
      phone,
      email,
    } = req.body;

    // Find customer
    const [existingCustomer] =
      await db
        .select()
        .from(customer)
        .where(
          eq(
            customer.id,
            customerId
          )
        );

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Validation
    if (
      name !== undefined &&
      !name.trim()
    ) {
      return res.status(400).json({
        message: "Customer name cannot be empty",
      });
    }

    // Build update object
    const updateData = {};

    if (name !== undefined) {
      updateData.name =
        name.trim();
    }

    if (phone !== undefined) {
      updateData.phone =
        phone?.trim() || null;
    }

    if (email !== undefined) {
      updateData.email =
        email?.trim() || null;
    }

    // Update customer
    const [updatedCustomer] =
      await db
        .update(customer)
        .set(updateData)
        .where(
          eq(
            customer.id,
            customerId
          )
        )
        .returning();

    // AUDIT LOG
    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE",
      module: "CUSTOMER",
      entityId: String(updatedCustomer.id),
      description: `Updated customer ${updatedCustomer.name}`,
    });

    return res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });

  } catch (error) {
    console.error(
      "Update customer error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update customer",
    });
  }
};


// =====================================================
// DELETE CUSTOMER
// =====================================================

export const deleteCustomer = async (
  req,
  res
) => {
  try {
    const customerId =
      Number(req.params.id);

    if (Number.isNaN(customerId)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    // Find customer first
    const [existingCustomer] =
      await db
        .select()
        .from(customer)
        .where(
          eq(
            customer.id,
            customerId
          )
        );

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Delete customer
    await db
      .delete(customer)
      .where(
        eq(
          customer.id,
          customerId
        )
      );

    // AUDIT LOG
    await createAuditLog({
      userId: req.user.id,
      action: "DELETE",
      module: "CUSTOMER",
      entityId: String(existingCustomer.id),
      description: `Deleted customer ${existingCustomer.name}`,
    });

    return res.status(200).json({
      message: "Customer deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete customer error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete customer",
    });
  }
};