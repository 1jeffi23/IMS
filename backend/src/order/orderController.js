import { asc, eq,sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products } from "../product/productModel.js";
import { orderItems } from "./orderItemModel.js";
import { orders } from "./orderModel.js";
import { productBatches } from "../product/productBatchModel.js";



export const createOrder = async (req,res) => {
    try {
        const {customerName,items} = req.body;
        let totalAmount = 0;
        const orderItemsData =[];
        
        //Check all items/product and calculate total
        for(const item of items){
            const product = await db.select().from(products).where(eq(products.id,item.productId));

             if(product.length === 0){
            return res.status(404).json({
                message: `Product ${item.productId} not found`,
            })
        }

        const currentProduct = product[0];

        //check stock
        if(currentProduct.quantity < item.quantity){
            return res.status(400).json({
                message: `Insufficient stock for ${currentProduct.name}`,
            })
        }

        const unitPrice = Number(currentProduct.unitPrice);
        const totalPrice = unitPrice*item.quantity;

        totalAmount += totalPrice;

        orderItemsData.push({
            productId: item.productId,
            productName: currentProduct.name,
            quantity: item.quantity,
            unitPrice: unitPrice.toString(),
            totalPrice: totalPrice.toString(),
        });

        }

        //2. create order
        const newOrder = await db.insert(orders).values({
            customerName,
            totalAmount: totalAmount.toString(),
        }).returning();

        const order = newOrder[0];

        //3. add orderId to every order item

        const itemsWithOrderId = orderItemsData.map((item)=>({
            ...item,
            orderId: order.id,
        }));

        const newOrderItems = await db.insert(orderItems).values(itemsWithOrderId).returning();

       
    } catch (error) {
        res.status(500).json({
            message: "failed to create order",
            error: error.message,
        })
        
    }
    
}

export const confirmOrder = async (req,res) => {
    try {
        const {id} = req.params;
        //1.find order
        const order = await db.select().from(orders).where(eq(orders.id,Number(id)));

        if(order.length === 0){
            return res.status(404).json({
                message: "Order not found",
            })
        }
        const currentOrder = order[0];

        //2.order must be pending
        if(currentOrder.status !== "pending"){
            return res.status(400).json({
                message: `order is already ${currentOrder.status}`,
            })
        }

        //3.get order items
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId,Number(id)));
        
        //4.process every ordered product
        for (const item of items) {
            let remainingQuantity = item.quantity;

            //5.get product batches
            const batches = (await db.select().from(productBatches)
            .where(eq(productBatches.productId,item.productId))
            .orderBy(asc(productBatches.expiryDate)));

            //6.check total batch stock
            const totalBatchStock = batches.reduce( (total,batch)=>total + Number(batch.quantity) ,0);

            if(totalBatchStock < Number(item.quantity)){
                return res.status(400).json({
                    message: `insufficient stock for ${item.quantity}`,
                });
            }

            //7. remove stock from batches
            for (const batch of batches) {
                if(remainingQuantity<0){
                    break;
                }

                const batchQuantity = Number(batch.quantity);

                if(batchQuantity >= remainingQuantity){
                    //current batch can fulfill the whole order
                    await db.update(productBatches).set({
                        quantity: batchQuantity - remainingQuantity,
                        updatedAt: new Date(),
                    }).where(eq(productBatches.id,batch.id));

                    remainingQuantity = 0;
                }else{
                    await db.update(productBatches).set({
                      quantity:0,
                      updatedAt: new Date(),  
                    }).where(eq(productBatches.id,batch.id));

                    remainingQuantity -= batchQuantity; 
                }
            }

            //8. decrease total product stock
            await db.update(products).set({
                quantity: sql`${products.quantity} - ${item.quantity}`,
                updatedAt: new Date(),
            }).where(eq(products.id,item.productId));          
        }

        //9.mark order as completed
        const updatedOrder = await db.update(orders).set({
            status: "completed",
            updatedAt: new Date(),
        }).where(eq(orders.id,Number(id))).returning();

        return res.status(200).json({
            message: "Order confirmed and stock upadated successfully",
            order: updatedOrder[0],
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cinfirm order",
            error: error.message,
        });
    }
    
}