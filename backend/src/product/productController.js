import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { productBatches } from "./productBatchModel.js";
import { products } from "./productModel.js";

// to get all procts from db
export const getProducts = async (req,res) => {
    try {
        const allProducts = await db.select().from(products);

    res.status(200).json({
        message: "Products fteched successfully",
        products: allProducts,
    });
        
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
        
    }
    
}

//productModel controller
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


//productbatchModel controller
export const createProductBatch = async (req, res) => {
    try {
        const { productId, batchNumber, quantity, costPrice, receivedDate, expiryDate, storageLocation } = req.body;

        //1.check if product exist in product tabel
        const product = await db.select().from(products).where(eq(products.id, productId));

        if (product.length === 0) {
            return res.status(404).json({
                message: "Product not found",
            })
        }

        //check whether batch already exists
        const existingBatch = await db.select().from(productBatches).where(eq(productBatches.batchNumber, batchNumber));

        if(existingBatch.length>0){
            //if batch exits update exisiting batch
            const batch = existingBatch[0];

            const updtaeBatch = await db.update(productBatches).set({
                quantity: sql`${productBatches.quantity}+${quantity}`,
                updatedAt: new Date(),
            }).where(eq(productBatches.id,batch.id)).returning();
            
             res.status(201).json({
            message: "Product batch updated successfully!",
            product: updtaeBatch[0],
        });
        }
        else{
              //2.if product exists and same batch doesn't then create batch
        const newBatch = await db.insert(productBatches).values({
            productId, batchNumber, quantity, costPrice, receivedDate, expiryDate, storageLocation
        }).returning();

        //3.Increase products total quantity in product table
        await db.update(products).set({
            quantity: sql`${products.quantity} + ${quantity}`,
            batch: newBatch[0],
        });
        res.status(201).json({
            message: "Product batch created successfully!",
            product: newBatch[0],
        });
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to add product batch",
            error: error.message,
        })

    }

}