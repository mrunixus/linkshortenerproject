# UI Components — shadcn/ui

All UI in this project is built exclusively with **shadcn/ui** components.  
No custom component primitives, third-party component libraries, or hand-rolled UI elements are permitted.

---

## Rules

- **shadcn/ui only** — Every button, input, dialog, card, badge, dropdown, table, form field, toast, and any other UI primitive must come from shadcn/ui. Never build equivalent components from scratch.
- **Install via CLI** — Add new shadcn/ui components using the CLI only:
  ```bash
  npx shadcn@latest add <component-name>
  ```
  This places generated files under `components/ui/`. Do not create files there manually.
- **Do not hand-edit `components/ui/`** — Files in this directory are owned by the shadcn CLI. Direct edits will be overwritten on the next `add` or `diff` run. Apply customisations through Tailwind tokens, CSS variables, or wrapper components instead.
- **Wrap, don't fork** — If a shadcn component needs project-specific defaults (e.g., a `<Button>` that is always `variant="destructive"`), create a thin wrapper in `components/` that composes the shadcn primitive. Never duplicate or modify the source file in `components/ui/`.
- **Use `cn()` for class composition** — When adding extra Tailwind classes to a shadcn component, always use `cn()` from `@/lib/utils`. Never use string concatenation or template literals for class names.
- **Respect the component API** — Use the props and variants that shadcn exposes (`variant`, `size`, `asChild`, etc.). Do not override internal styles with inline `style` props unless absolutely necessary.
- **Form components use `react-hook-form` + shadcn `<Form>`** — All forms must be built with the shadcn `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, and `FormMessage` components wired to `react-hook-form`. Never build uncontrolled forms or manage form state manually.

---

## Available Components

Run the following to see what is already installed:

```bash
npx shadcn@latest diff
```

Before installing a new component, check `components/ui/` to confirm it does not already exist.

---

## Adding a New Component — Step by Step

1. Identify the shadcn component you need from [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).
2. Run the CLI:
   ```bash
   npx shadcn@latest add <component-name>
   ```
3. Import the component using the `@/` alias:
   ```tsx
   import { Button } from "@/components/ui/button";
   ```
4. Use the component directly in your page or feature component.

---

## What Is Not Allowed

| Prohibited | Use Instead |
|---|---|
| `<button>` raw HTML element | `<Button>` from `@/components/ui/button` |
| `<input>` raw HTML element | `<Input>` from `@/components/ui/input` |
| Custom modal/dialog built with `useState` + CSS | `<Dialog>` from `@/components/ui/dialog` |
| Custom dropdown from scratch | `<DropdownMenu>` from `@/components/ui/dropdown-menu` |
| Heroicons, Radix primitives used directly | Compose via shadcn components (which already wrap Radix) |
| Any third-party UI library (MUI, Chakra, Ant Design, etc.) | shadcn/ui |

---

## Theming & Tokens

- All colour, radius, and spacing tokens are defined as CSS variables in `app/globals.css`.
- To change a theme token (e.g., primary colour), update the CSS variable — never hard-code a specific Tailwind colour class on a shadcn primitive.
- Dark mode is handled automatically via the `dark` class on `<html>` — do not implement a custom dark mode toggle that bypasses this.
- **Fonts** — The project uses **Geist** (`--font-geist-sans`) as the primary sans-serif font and **Geist Mono** (`--font-geist-mono`) as the monospace font. Both are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables. Do not introduce additional font families.
