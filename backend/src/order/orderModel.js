import {
  pgTable,
  serial,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  customerName: varchar("customer_name", {
    length: 255,
  }).notNull(),

  status: varchar("status", {
    length: 50,
  }).notNull().default("pending"),

  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});