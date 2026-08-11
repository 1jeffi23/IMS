import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { products } from "./productModel.js";

export const productBatches = pgTable("product_batches", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id),

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
    .notNull(),
});