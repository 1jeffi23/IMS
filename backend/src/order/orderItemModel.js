import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "./orderModel.js";
import { products } from "../product/productModel.js";

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),

  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id),

  productName: varchar("name", { length: 255 }).notNull(),

  quantity: integer("quantity")
    .notNull(),

  unitPrice: numeric("unit_price", {
    precision: 10,
    scale: 2,
  }).notNull(),

  totalPrice: numeric("total_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
});