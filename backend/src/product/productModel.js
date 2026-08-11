import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  sku: varchar("sku", { length: 100 }).notNull().unique(),

  unit: varchar("unit", { length: 50 })
    .notNull()
    .default("piece"),

  unitPrice: numeric("unit_price", {
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
    .notNull()
    .default(true),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});