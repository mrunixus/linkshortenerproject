"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateLinkForUser, deleteLinkForUser } from "@/data/links";

const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(50, "Slug must be 50 characters or less")
  .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens, and underscores");

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  slug: slugSchema,
  originalUrl: z.string().url("Please enter a valid URL"),
});

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

type ActionResult = { success: true } | { error: string };

export async function updateLink(input: UpdateLinkInput): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  try {
    const updated = await updateLinkForUser({ ...parsed.data, userId });
    if (!updated) return { error: "Link not found or you do not have permission to edit it." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update link";
    if (message.includes("unique")) return { error: "That slug is already taken." };
    return { error: message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLink(input: DeleteLinkInput): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  try {
    const deleted = await deleteLinkForUser({ id: parsed.data.id, userId });
    if (!deleted) return { error: "Link not found or you do not have permission to delete it." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete link";
    return { error: message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
