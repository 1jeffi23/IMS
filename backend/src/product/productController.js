import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { productBatches } from "./productBatchModel.js";
import { products } from "./productModel.js";
import { numeric } from "drizzle-orm/sqlite-core";

// to get all procts from db
export const getProducts = async (req, res) => {
    try {
        const allProducts = await db.select().from(products);

        res.status(200).json({
            message: "Products fetched successfully",
            products: allProducts,
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });

    }

}

//productModel controller..add products
export const createProduct = async (req, res) => {
    try {
        const { name, sku, unit, unitPrice, quantity, reorderLevel, storageTime } = req.body;

        const newProduct = await db.insert(products).values({
            name, sku, unit, unitPrice, quantity, reorderLevel, storageTime
        }).returning();

        res.status(201).json({
            message: "Product created successfully!",
            product: newProduct[0],
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });

    }

}


//edit product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, unit, unitPrice, quantity, reorderLevel, storageTime, isActive } = req.body;

        const updateProdut = await db.update(products)
            .set({ name, sku, unit, unitPrice, quantity, reorderLevel, storageTime, isActive, updatedAt: new Date(), })
            .where(eq(products.id, Number(id))).returning();

        if (updateProduct.length === 0) {
            res.status(404).json({
                message: "Product not found",
            });
        }
        res.status(200).json({
            message: "product updated successfully",
            product: updateProduct[0],
        });

    } catch (error) {
        res.status(500).json({
            message: "failed to update the product",
            error: error.message,
        });

    }

}

//delete product

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteProduct = await db.delete(products)
            .where(eq(products.id, Number(id))).returning();

        if (deleteProduct.length === 0) {
            res.status(404).json({
                message: "Product not found",
            });

        }
         res.status(200).json({
                message: "product deleted successfully",
                product: deleteProduct[0],
            });

    } catch (error) {
        res.status(500).json({
            message: "failed to delete the product",
            error: error.message,
        });

    }

}


//get single product
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await db.select().from(products).where(eq(products.id, Number(id)));

        if (product.length === 0) {
            res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "product feteched successfully",
            product: product[0],
        });

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch the product",
            error: error.message,
        });

    }

}


export const createProductBatch = async (req, res) => {
  try {
    const {
      productId,
      batchNumber,
      quantity,
      costPrice,
      receivedDate,
      expiryDate,
      storageLocation,
    } = req.body;

    // 1. Check product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(productId)));

    if (product.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // 2. Check whether batch already exists
    const existingBatch = await db
      .select()
      .from(productBatches)
      .where(eq(productBatches.batchNumber, batchNumber));

    if (existingBatch.length > 0) {

      // Existing batch
      const batch = existingBatch[0];

      // Add new quantity to existing batch
      const updatedBatch = await db
        .update(productBatches)
        .set({
          quantity: sql`${productBatches.quantity} + ${quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(productBatches.id, batch.id))
        .returning();

      // Increase product total quantity
      await db
        .update(products)
        .set({
          quantity: sql`${products.quantity} + ${quantity}`,
        })
        .where(eq(products.id, Number(productId)));

      return res.status(201).json({
        message: "Product batch updated successfully!",
        batch: updatedBatch[0],
      });
    }

    // 3. Create new batch
    const newBatch = await db
      .insert(productBatches)
      .values({
        productId: Number(productId),
        batchNumber,
        quantity,
        costPrice,
        receivedDate,
        expiryDate,
        storageLocation,
      })
      .returning();

    // 4. Increase product total quantity
    await db
      .update(products)
      .set({
        quantity: sql`${products.quantity} + ${quantity}`,
      })
      .where(eq(products.id, Number(productId)));

    return res.status(201).json({
      message: "Product batch created successfully!",
      batch: newBatch[0],
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to add product batch",
      error: error.message,
    });
  }
};

export const getProductBatches = async (req, res) => {
  try {
    const allBatches = await db
      .select({
        id: productBatches.id,
        productId: productBatches.productId,
        batchNumber: productBatches.batchNumber,
        quantity: productBatches.quantity,
        costPrice: productBatches.costPrice,
        receivedDate: productBatches.receivedDate,
        expiryDate: productBatches.expiryDate,
        storageLocation: productBatches.storageLocation,

        // Product ki information
        productName: products.name,
        sku: products.sku,
      })
      .from(productBatches)
      .leftJoin(
        products,
        eq(productBatches.productId, products.id)
      );

    res.status(200).json({
      message: "Product batches fetched successfully",
      batches: allBatches,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch product batches",
      error: error.message,
    });
  }
};

export const updateProductBatch = async (req,res) => {
    try {
        const {id} = req.params;

        const {
            batchNumber,quantity,costPrice,receivedDate,expiryDate,storageLocation} = req.body;

        //1. find existing batch
        const exisitingBtach = await db.select().from(productBatches).where(eq(productBatches.id,Number(id)));

        if(exisitingBtach.length === 0){
            return res.status(404).json({
                message: "Product batch not found",
            });
        }

        const oldBatch = exisitingBtach[0];

        const quantityDifference = Number(quantity) - Number(oldBatch.quantity);

        //update batch
        const updateBatch = await db.update(productBatches).set({
            batchNumber,
            quantity,
            costPrice,
            receivedDate,
            expiryDate,
            storageLocation,
            updatedAt: new Date(),
        }).where(eq(productBatches.id,Number(id))).returning();

        //update product total quantity
        await db.update(products).set({
            quantity: sql`${products.quantity}+${quantityDifference}`,
        }).where(eq(products.id,oldBatch.productId));

        return res.status(200).json({
            message: "Product batch updated successfully!",
            batch: updateBatch[0],
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update product batch",
            error: error.message,
        })
        
    }
    
};

export const deleteProductBatch = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find existing batch
    const existingBatch = await db
      .select()
      .from(productBatches)
      .where(eq(productBatches.id, Number(id)));

    if (existingBatch.length === 0) {
      return res.status(404).json({
        message: "Product batch not found",
      });
    }

    const oldBatch = existingBatch[0];

    // 2. Remove batch quantity from product total quantity
    await db
      .update(products)
      .set({
        quantity: sql`${products.quantity} - ${oldBatch.quantity}`,
      })
      .where(eq(products.id, oldBatch.productId));

    // 3. Delete batch
    await db
      .delete(productBatches)
      .where(eq(productBatches.id, Number(id)));

    return res.status(200).json({
      message: "Product batch deleted successfully",
    });

  } catch (error) {
    console.log("DELETE BATCH ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete product batch",
      error: error.message,
    });
  }
};
//get single batch
export const getProductBtachById = async (req, res) => {
    try {
        const { id } = req.params;

        const productBatch = await db.select().from(productBatches).where(eq(productBatches.id, Number(id)));

        if (productBatch.length === 0) {
            res.status(404).json({
                message: "Product batch not found",
            });
        }

        res.status(200).json({
            message: "product batch feteched successfully",
            batch: productBatch[0],
        });

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch the product batch",
            error: error.message,
        });

    }

}