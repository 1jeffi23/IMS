import {
  pgTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const customer = pgTable("customer", {
  id: serial("id").primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  phone: varchar("phone", {
    length: 50,
  }),

  email: varchar("email", {
    length: 255,
  }).unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});