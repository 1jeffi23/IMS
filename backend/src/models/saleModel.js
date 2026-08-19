import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { customer } from "./customerModel.js";


export const sale = pgTable("sale", {

  id: serial("id").primaryKey(),


  customerId: integer("customer_id")
    .references(() => customer.id, {
      onDelete: "set null",
    }),


  subtotal: numeric("subtotal", {
    precision: 12,
    scale: 2,
  }).notNull(),


  discount: numeric("discount", {
    precision: 12,
    scale: 2,
  }).notNull().default("0"),


  tax: numeric("tax", {
    precision: 12,
    scale: 2,
  }).notNull().default("0"),


  total: numeric("total", {
    precision: 12,
    scale: 2,
  }).notNull(),


  paymentMethod: varchar(
    "payment_method",
    {
      length: 20,
    }
  ).notNull(),


  amountPaid: numeric("amount_paid", {
    precision: 12,
    scale: 2,
  }).notNull(),


  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});