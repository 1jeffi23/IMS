import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

import { purchase } from "./purchaseModel.js";
import { product } from "./productModel.js";
import { productBatch } from "./productBatchModel.js";

export const purchaseItem = pgTable(
  "purchase_item",
  {
    id: serial("id").primaryKey(),

    purchaseId: integer("purchase_id")
      .notNull()
      .references(() => purchase.id, {
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

    costPrice: numeric("cost_price", {
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