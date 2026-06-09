---
description: Read this before implementing or modifying authentication in the project. This file defines the authentication rules and best practices for the project, which uses Clerk for all auth needs.
---

# Authentication — Clerk

All authentication in this project is handled exclusively by **Clerk** (`@clerk/nextjs`).  
No other auth libraries, custom JWT logic, session handling, or OAuth implementations are permitted.

---

## Rules

- **Clerk only** — Never implement custom auth, NextAuth, or any alternative. If auth is needed, use Clerk.
- **`ClerkProvider` is required** — It must wrap the entire app in `app/layout.tsx` (already in place).
- **`/dashboard` is protected** — Users must be authenticated to access any route under `/dashboard`. Unauthenticated users are redirected to the sign-in modal.
- **Home page redirect** — If a signed-in user visits `/` (home), they must be redirected to `/dashboard`.
- **Modal-only sign in/out** — `<SignInButton>` and `<SignUpButton>` must always use `mode="modal"`. Never navigate to a dedicated `/sign-in` or `/sign-up` page.
- **Server-only Clerk helpers** — `auth()` and `currentUser()` are server-side only. Never call them inside `"use client"` components.
- **Client-side hooks** — Use `useAuth()` or `useUser()` from `@clerk/nextjs` inside client components.
- **API route protection** — Every Route Handler that reads or writes user data must call `auth()` and return `401` if `userId` is `null`.

---

## 1. Middleware Setup

Create `middleware.ts` at the project root (next to `package.json`). This file controls which routes are public and which are protected.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",            // home — handled manually below for auth redirect
  "/r/(.*)",      // public short-link redirects — must never be gated
]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect authenticated users away from home to /dashboard
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect /dashboard and all sub-routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run middleware on all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**Key points:**
- `auth.protect()` automatically redirects unauthenticated users; it does **not** return a response you need to handle — it throws a redirect internally.
- `/r/(.*)` must always remain in the public matcher so short-link redirects work without authentication.
- Do not add `/sign-in` or `/sign-up` routes — Clerk modals handle the UI entirely.

---

## 2. Sign In / Sign Up — Always Modal

Use `mode="modal"` on every `<SignInButton>` and `<SignUpButton>`. Never link to a `/sign-in` page.

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

// Correct ✅
<SignInButton mode="modal">
  <button>Sign in</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Get started</button>
</SignUpButton>

// Wrong ❌ — omitting mode defaults to redirect, which creates a broken /sign-in page
<SignInButton>
  <button>Sign in</button>
</SignInButton>
```

---

## 3. Sign Out

Use the `<UserButton>` component — it renders the user avatar and includes a built-in sign-out option in its dropdown. This is the **preferred** way to expose sign-out to users.

```tsx
import { UserButton } from "@clerk/nextjs";

<UserButton />
```

If you need a standalone sign-out trigger (e.g., a custom button in a sidebar), use `<SignOutButton>`:

```tsx
import { SignOutButton } from "@clerk/nextjs";

<SignOutButton>
  <button>Sign out</button>
</SignOutButton>
```

---

## 4. Showing Auth UI Conditionally

Use Clerk's `<Show>` component (or `<SignedIn>` / `<SignedOut>`) to conditionally render content based on auth state.

```tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal">
    <button>Sign in</button>
  </SignInButton>
</SignedOut>

<SignedIn>
  <UserButton />
</SignedIn>
```

> `<Show when="signed-in">` / `<Show when="signed-out">` are equivalent aliases — either style is acceptable.

---

## 5. Reading Auth in Server Components and Route Handlers

```ts
import { auth, currentUser } from "@clerk/nextjs/server";

// In a Server Component or Route Handler:
const { userId } = await auth();

if (!userId) {
  // Return 401 in Route Handlers
  return new Response("Unauthorized", { status: 401 });
}

// For the full user object (makes a network request to Clerk):
const user = await currentUser();
```

**Rules:**
- Always scope database queries to `userId` — never fetch or mutate another user's data.
- Prefer `auth()` over `currentUser()` when you only need the `userId` (it's faster — no extra network call).

---

## 6. Reading Auth in Client Components

```tsx
"use client";
import { useAuth, useUser } from "@clerk/nextjs";

export function ProfileBadge() {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) return null;
  return <span>{user?.firstName}</span>;
}
```

**Never** call `auth()` or `currentUser()` (server helpers) inside a `"use client"` component — doing so will throw at runtime.

---

## 7. Environment Variables

Clerk requires these variables in `.env.local`. Never commit them to source control.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

No`NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL` should be set — those are only needed for dedicated sign-in pages, which this project does not use.

---

## 8. Route Summary

| Route | Auth requirement |
|---|---|
| `/` | Public; authenticated users are redirected to `/dashboard` |
| `/dashboard` and sub-routes | Protected — requires authentication |
| `/r/[slug]` | Public — must never be gated |
| `/api/**` | Protected per-handler via `auth()` check |

---

## Common Mistakes to Avoid

| Mistake | Correct approach |
|---|---|
| Using `<SignInButton>` without `mode="modal"` | Always pass `mode="modal"` |
| Calling `auth()` inside a `"use client"` component | Use `useAuth()` instead |
| Forgetting `auth()` check in a Route Handler | Always check `userId` and return `401` |
| Importing NextAuth, Passport, or any other auth lib | Use Clerk exclusively |
| Adding `/r/[slug]` to the protected matcher | Keep it in the public matcher |
| DB queries without `userId` filter | Always scope to the authenticated user |
