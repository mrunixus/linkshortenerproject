"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createLinkForUser } from "@/data/links";

const createLinkSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be 50 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores"),
  originalUrl: z.string().url("Please enter a valid URL"),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

type ActionResult =
  | { success: true }
  | { error: string; fieldErrors?: Partial<Record<keyof CreateLinkInput, string[]>> };

export async function createLink(input: CreateLinkInput): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<
        Record<keyof CreateLinkInput, string[]>
      >,
    };
  }

  try {
    await createLinkForUser({ ...parsed.data, userId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create link";
    if (message.includes("unique")) return { error: "That slug is already taken." };
    return { error: message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
