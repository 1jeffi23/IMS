import { db } from "../../db/index.js";
import { customer } from "../models/customerModel.js";

import { eq } from "drizzle-orm";


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


    // -----------------------------
    // Validation
    // -----------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }


    // -----------------------------
    // Create customer
    // -----------------------------

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

// export const deleteCustomer = async (req,res) => {
//     const {id} = req.params;

//     await db.delete(customer).where(eq(customer.id,Number(id)));
//     res.status(200).json({
//         message: "customer deletd successfully"
//     })

    
// }