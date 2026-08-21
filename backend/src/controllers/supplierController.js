import { db } from "../../db/index.js";

import {
  supplier,
} from "../models/supplierModel.js";

import {
  eq,
} from "drizzle-orm";

import { createAuditLog } from "../../utils/auditLogger.js";



// CREATE SUPPLIER


export const createSupplier = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Supplier name is required",
      });
    }

    const [newSupplier] = await db
      .insert(supplier)
      .values({
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        address: address?.trim() || null,
      })
      .returning();


    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      module: "SUPPLIER",
      entityId: String(newSupplier.id),
      description: `Created supplier ${newSupplier.name}`,
    });


    return res.status(201).json({
      message: "Supplier created successfully",
      supplier: newSupplier,
    });

  } catch (error) {
    console.error("Create supplier error:", error);

    return res.status(500).json({
      message: "Failed to create supplier",
    });
  }
};



// GET ALL SUPPLIERS
// No audit log for GET


export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await db
      .select()
      .from(supplier);

    return res.status(200).json({
      message: "Suppliers fetched successfully",
      suppliers,
    });

  } catch (error) {
    console.error("Get suppliers error:", error);

    return res.status(500).json({
      message: "Failed to fetch suppliers",
    });
  }
};



// GET SUPPLIER BY ID
// No audit log for GET


export const getSupplierById = async (req, res) => {
  try {
    const supplierId = Number(req.params.id);

    if (Number.isNaN(supplierId)) {
      return res.status(400).json({
        message: "Invalid supplier ID",
      });
    }

    const [existingSupplier] = await db
      .select()
      .from(supplier)
      .where(eq(supplier.id, supplierId));

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      message: "Supplier fetched successfully",
      supplier: existingSupplier,
    });

  } catch (error) {
    console.error(
      "Get supplier by ID error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch supplier",
    });
  }
};



// UPDATE SUPPLIER


export const updateSupplier = async (req, res) => {
  try {
    const supplierId = Number(req.params.id);

    if (Number.isNaN(supplierId)) {
      return res.status(400).json({
        message: "Invalid supplier ID",
      });
    }

    const {
      name,
      phone,
      email,
      address,
      isActive,
    } = req.body;

    const [existingSupplier] = await db
      .select()
      .from(supplier)
      .where(eq(supplier.id, supplierId));

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Supplier name cannot be empty",
        });
      }

      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      updateData.phone =
        phone.trim() || null;
    }

    if (email !== undefined) {
      updateData.email =
        email.trim() || null;
    }

    if (address !== undefined) {
      updateData.address =
        address.trim() || null;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }


    const [updatedSupplier] = await db
      .update(supplier)
      .set(updateData)
      .where(eq(supplier.id, supplierId))
      .returning();


    // AUDIT LOG

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE",
      module: "SUPPLIER",
      entityId: String(updatedSupplier.id),
      description: `Updated supplier ${updatedSupplier.name}`,
    });


    return res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });

  } catch (error) {
    console.error(
      "Update supplier error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update supplier",
    });
  }
};