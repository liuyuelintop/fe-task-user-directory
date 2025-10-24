# Phase 0: Setup (0–5 min)

> **Audience:** Interview run-through  
> **Time:** 5 minutes  
> **Prereqs:** Node 18+, npm, Next.js familiarity

Ship the scaffold quickly so you can spend the rest of the session on product work.

## Step 1 — Create the project

```bash
npx create-next-app@latest user-directory --typescript --tailwind --app --no-src
```

Accept the prompts: TypeScript ✅, ESLint ✅, Tailwind ✅, App Router ✅, no custom alias.

**Expected:** `user-directory/` with the standard App Router layout.

## Step 2 — Install dependencies

```bash
cd user-directory
npm install @tanstack/react-query
```

**Expected:** React Query added to the project.

## Step 3 — Run the dev server

```bash
npm run dev
```

Confirm the default Next.js page at http://localhost:3000 and watch for terminal errors.

> ✅ **Checkpoint:** Dev server running cleanly.

### Next

- Continue to [Phase 1: Data Layer](02-data-layer.md).
- If something fails, jump to [Common Issues](../troubleshooting/common-issues.md#issue-dev-server-not-running).*** End Patch
