import db from "@/db";
import { links, type SelectLink } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.createdAt));
}

export async function createLinkForUser({
  slug,
  originalUrl,
  userId,
}: {
  slug: string;
  originalUrl: string;
  userId: string;
}): Promise<SelectLink> {
  const [created] = await db
    .insert(links)
    .values({ slug, originalUrl, userId })
    .returning();
  return created;
}

export async function updateLinkForUser({
  id,
  slug,
  originalUrl,
  userId,
}: {
  id: number;
  slug: string;
  originalUrl: string;
  userId: string;
}): Promise<SelectLink | null> {
  const [updated] = await db
    .update(links)
    .set({ slug, originalUrl })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return updated ?? null;
}

export async function deleteLinkForUser({
  id,
  userId,
}: {
  id: number;
  userId: string;
}): Promise<boolean> {
  const result = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({ id: links.id });
  return result.length > 0;
}

export async function getLinkBySlug(slug: string): Promise<SelectLink | null> {
  const [link] = await db.select().from(links).where(eq(links.slug, slug)).limit(1);
  return link ?? null;
}
