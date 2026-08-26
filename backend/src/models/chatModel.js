import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./authModel.js";

export const conversationTypeEnum = pgEnum(
  "conversation_type",
  ["direct", "group"]
);

export const conversation = pgTable("conversation", {
  id: serial("id").primaryKey(),

  type: conversationTypeEnum("type").notNull(),

  name: text("name").unique(),

  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const conversationParticipant = pgTable(
  "conversation_participant",
  {
    id: serial("id").primaryKey(),

    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversation.id, {
        onDelete: "cascade",
      }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    joinedAt: timestamp("joined_at")
      .defaultNow()
      .notNull(),

    lastReadAt: timestamp("last_read_at"),
  },

  (table) => [
    unique("conversation_participant_unique").on(
      table.conversationId,
      table.userId
    ),
  ]
);

export const chatMessage = pgTable("chat_message", {
  id: serial("id").primaryKey(),

  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversation.id, {
      onDelete: "cascade",
    }),

  senderId: text("sender_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});