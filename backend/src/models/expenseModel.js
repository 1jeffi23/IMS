import {
  pgTable,
  serial,
  varchar,
  numeric,
  date,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

import { user } from "./authModel.js";

export const expense = pgTable("expense", {
  id: serial("id").primaryKey(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  category: varchar("category", {
    length: 100,
  }).notNull(),

  amount: numeric("amount", {
    precision: 12,
    scale: 2,
  }).notNull(),

  expenseDate: date("expense_date")
    .notNull(),

  description: varchar("description", {
    length: 500,
  }),

  createdBy: varchar("created_by")
    .notNull()
    .references(() => user.id),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});