import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { category } from "./categoryModel.js";

export const product = pgTable("product", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 })
    .notNull(),

  sku: varchar("sku", { length: 100 })
    .notNull()
    .unique(),

  categoryId: integer("category_id")
    .notNull()
    .references(() => category.id),

  unit: varchar("unit", { length: 50 })
    .notNull()
    .default("piece"),

  sellingPrice: numeric("selling_price", {
    precision: 10,
    scale: 2,
  }).notNull(),

  quantity: integer("quantity")
    .notNull()
    .default(0),

  reorderLevel: integer("reorder_level")
    .notNull()
    .default(10),

  storageTime: integer("storage_time"),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});