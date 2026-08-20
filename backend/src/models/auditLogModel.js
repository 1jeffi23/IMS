import {
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./authModel.js";

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),

    // User who performed the action
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    // Example: LOGIN, CREATE, UPDATE, DELETE, LOGOUT
    action: text("action").notNull(),

    // Example: AUTH, PRODUCT, SALE, PURCHASE, CUSTOMER
    module: text("module").notNull(),

    // ID of the affected record, if applicable
    entityId: text("entity_id"),

    // Human-readable description
    description: text("description").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_log_userId_idx").on(table.userId),
    index("audit_log_module_idx").on(table.module),
    index("audit_log_createdAt_idx").on(table.createdAt),
  ],
);

