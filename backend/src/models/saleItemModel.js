import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

import { sale } from "./saleModel.js";
import { product } from "./productModel.js";
import { productBatch } from "./productBatchModel.js";


export const saleItem = pgTable(
  "sale_item",
  {

    id: serial("id").primaryKey(),


    saleId: integer("sale_id")
      .notNull()
      .references(() => sale.id, {
        onDelete: "cascade",
      }),


    productId: integer("product_id")
      .notNull()
      .references(() => product.id),

    batchId: integer("batch_id")
      .notNull()
      .references(() => productBatch.id),


    quantity: integer("quantity")
      .notNull(),


    unitPrice: numeric("unit_price", {
      precision: 10,
      scale: 2,
    }).notNull(),


    totalPrice: numeric("total_price", {
      precision: 12,
      scale: 2,
    }).notNull(),


    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  }
);