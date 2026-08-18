import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  date,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { product } from "./productModel.js";

export const productBatch = pgTable(
  "product_batch",
  {
    id: serial("id").primaryKey(),

    productId: integer("product_id")
      .notNull()
      .references(() => product.id),

    batchNumber: varchar("batch_number", {
      length: 100,
    }).notNull(),

    quantity: integer("quantity")
      .notNull()
      .default(0),

    costPrice: numeric("cost_price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    receivedDate: date("received_date")
      .notNull(),

    expiryDate: date("expiry_date"),

    storageLocation: varchar("storage_location", {
      length: 100,
    }),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [
    unique("product_batch_unique").on(
      table.productId,
      table.batchNumber
    ),
  ]
);