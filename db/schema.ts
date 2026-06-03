import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: text('slug').notNull().unique(),
  originalUrl: text('original_url').notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type SelectLink = typeof links.$inferSelect;
export type InsertLink = typeof links.$inferInsert;
