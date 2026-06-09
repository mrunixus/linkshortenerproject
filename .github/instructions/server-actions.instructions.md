---
description: Read this before implementing or modifying data mutations in the project. This file defines the rules and best practices for server actions, which are the exclusive mechanism for all data mutations.
applyTo: "**/*.ts,**/*.tsx"
---

# Server Actions

All data mutations (create, update, delete) must be performed via **Next.js Server Actions**. Never mutate data directly inside a component, Route Handler, or API route.

---

## Rules

- **Server actions only** — All data mutations must go through a server action. No exceptions.
- **Client components call server actions** — Server actions must always be invoked from a `"use client"` component.
- **File naming and colocation** — Every server action file must be named `actions.ts` and placed in the same directory as the client component that calls it.
- **Typed inputs, no `FormData`** — All arguments passed to server actions must use explicit TypeScript types. Never use the `FormData` type as a parameter.
- **Zod validation required** — Every server action must validate all incoming data with a Zod schema before any logic executes.
- **Auth check first** — Every server action must call `auth()` from `@clerk/nextjs/server` and return early with an error object if no `userId` is present.
- **Return, never throw** — Server actions must never throw errors. Always return a typed result object with either a `success` property (on success) or an `error` property (on failure).
- **No direct Drizzle in actions** — Server actions must never import or call Drizzle ORM directly. All database operations must delegate to helper functions in the `/data` directory.

---

## Step-by-Step: Adding a Server Action

### 1. Create `actions.ts` next to the calling component

```
app/dashboard/
  page.tsx          ← server component (renders the client component)
  LinksTable/
    index.tsx       ← "use client" component that calls the action
    actions.ts      ← server action lives here
```

### 2. Define a Zod schema and a matching TypeScript type

```ts
// app/dashboard/LinksTable/actions.ts
"use server";

import { z } from "zod";

const createLinkSchema = z.object({
  slug: z.string().min(1).max(50),
  originalUrl: z.string().url(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;
```

### 3. Add the auth check at the top of every action

```ts
import { auth } from "@clerk/nextjs/server";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // ... continue below
}
```

### 4. Validate input with the Zod schema

```ts
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };
```

### 5. Delegate to a `/data` helper — never use Drizzle directly

```ts
  // ✅ correct — use a helper from /data
  await createLinkForUser({ ...parsed.data, userId });

  // ❌ wrong — never call db / drizzle inside an action
  // await db.insert(links).values({ ...parsed.data, userId });
```

### 6. Call the action from a `"use client"` component

```tsx
// app/dashboard/LinksTable/index.tsx
"use client";

import { createLink } from "./actions";

export function CreateLinkForm() {
  async function handleSubmit(data: CreateLinkInput) {
    await createLink(data);
  }
  // ...
}
```

---

## Complete Example

```ts
// app/dashboard/LinksTable/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLinkForUser } from "@/data/links";

const createLinkSchema = z.object({
  slug: z.string().min(1).max(50),
  originalUrl: z.string().url(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(input: CreateLinkInput) {
  // 1. Auth check
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // 2. Validate
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  // 3. Delegate to /data helper
  await createLinkForUser({ ...parsed.data, userId });

  return { success: true };
}
```
