import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { supplier } from "./supplierModel.js";
import { user } from "./authModel.js";

export const purchase = pgTable("purchase", {
  id: serial("id").primaryKey(),

  supplierId: integer("supplier_id")
    .notNull()
    .references(() => supplier.id),

  invoiceNumber: varchar("invoice_number", {
    length: 100,
  }).notNull(),

  purchaseDate: date("purchase_date")
    .notNull(),

  totalAmount: numeric("total_amount", {
    precision: 12,
    scale: 2,
  })
    .notNull()
    .default("0"),

  createdBy: varchar("created_by")
    .notNull()
    .references(() => user.id),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});


