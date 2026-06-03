# Agent Instructions — Link Shortener Project

This file is the entry point for LLM agent instructions. All coding standards, conventions, and architectural decisions for this project are documented here and in the `/docs` directory.

> [!CAUTION]
> **MANDATORY — NO EXCEPTIONS:** You MUST read every relevant file in the `/docs` directory **before writing, modifying, or generating any code whatsoever**. This is not optional. Generating code without first reading the applicable docs is a critical violation. If a task touches authentication, read `docs/authentication.md`. If it touches UI, read `docs/ui-components.md`. When in doubt, read all docs files.

## Docs Index

| File | Purpose |
|---|---|
| [docs/authentication.md](docs/authentication.md) | Clerk authentication rules: protected routes, modal sign-in/out, server vs. client helpers, middleware setup |
| [docs/ui-components.md](docs/ui-components.md) | shadcn/ui usage rules: install via CLI, no custom primitives, wrapping conventions, theming |

## Quick-Reference Rules

The following rules are critical — violations are considered bugs:

1. **Server-only data access** — Never import `db` or Clerk server functions inside `"use client"` components.
2. **Scope all DB queries to `userId`** — Always filter by the authenticated Clerk `userId`; never return another user's data.
3. **Protect all API routes** — Every Route Handler that touches user data must call `auth()` and return `401` if unauthenticated.
4. **Use `cn()` for class composition** — Never concatenate Tailwind classes with string templates; always use `cn()` from `@/lib/utils`.
5. **Do not hand-edit `components/ui/`** — These files are managed by the shadcn CLI.
6. **Use `@/` path aliases** — Never use relative `../` imports when an absolute alias is available.
7. **No raw SQL** — Use the Drizzle ORM query builder exclusively.
8. **TypeScript strict mode** — No `any`, no `// @ts-ignore` without justification.
9. **Public redirect route** — `/r/[slug]` must remain publicly accessible (no auth guard) for link redirects to work.
10. **Lint before committing** — Run `npm run lint` and resolve all errors.
11. **shadcn/ui only** — All UI must use shadcn/ui components. Never build custom component primitives or use other component libraries. Add new components with `npx shadcn@latest add <name>`.
12. **No `middleware.ts`** — `middleware.ts` is deprecated in Next.js 16 (the version used in this project). **Never create or modify `middleware.ts`**. Use `proxy.ts` instead for all proxy and middleware logic.
