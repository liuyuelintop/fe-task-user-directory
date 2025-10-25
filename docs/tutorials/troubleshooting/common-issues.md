# Common Issues & Fixes

> **Audience:** When something breaks mid-build  
> **Time:** 2–5 minutes per issue  
> **Prereqs:** Access to the dev server and logs

## Issue: Dev server not running

**Symptoms:** `npm run dev` fails or hangs, browser can’t connect.

**Checks:**
- Ensure dependencies installed (`npm install`).  
- Kill stray dev servers (`lsof -nP -iTCP:3000` if needed) and retry.  
- Confirm Node 18+; older versions choke on the latest Next.js release.

## Issue: React Query not working

**Symptoms:** `useQuery is not a function`, or hook returns `undefined`.

**Fix:**
1. Check `package.json` for `@tanstack/react-query`.  
2. Ensure `app/providers.tsx` is marked `'use client'`.  
3. Wrap the app with `<Providers>` in `app/layout.tsx`.  
4. Restart the dev server after installing dependencies.

## Issue: TypeScript can’t resolve `@/types`

**Symptoms:** `Cannot find module '@/types'`.

**Fix:**
- Verify `types/index.ts` exists.  
- Confirm `paths` in `tsconfig.json` include `@/*`.  
- Restart the TypeScript server / dev server so the new path is picked up.

## Issue: Tailwind classes not applying

**Symptoms:** Layout renders unstyled despite using Tailwind classes.

**Fix:**
- Make sure Tailwind was selected during `create-next-app`.  
- Confirm `globals.css` imports Tailwind’s base/components/utilities.  
- Run `npm run dev` again; initial boot sometimes misses new CSS imports.

## Issue: Favorites not persisting

**Symptoms:** Favorites reset after refresh.

**Fix:**
- Confirm `useFavorites` writes to `localStorage` (and runs in a browser-only context).  
- Avoid private or incognito windows that disable storage.  
- Check the console for quota errors or JSON parse failures.

## Issue: Favorites vs Data Mismatch

**Symptoms:** Favorites badge counts don’t match, or favorites tab is empty even with saved IDs.

**Root cause:** Randomuser without a seed returns a new dataset each fetch. React Query may refetch on window focus/reconnect, so stored IDs no longer appear in the current results.

**Fix:**  
- Keep the API seeded (`seed=user-directory`) and use `login.uuid` for `User.id`.  
- Set a generous `staleTime` and disable focus/reconnect refetch.  
- Calculate the favorites badge as the intersection of saved IDs and currently loaded users.  
- (Optional) Prune missing IDs or store lightweight snapshots alongside the favorite ID.

### Related reading

- Architecture notes and trade-offs: [Interview Q&A](../interview/qa.md#q12-how-do-you-handle-the-favorites-data-mismatch-issue).  
- Full bug write-up: `docs/known-issues/favorites-data-mismatch.md`.

## Issue: Search input loses focus while typing

**Symptoms:** Typing into the search bar briefly blanks the page with “Loading users…” and the input loses focus, forcing you to click again for every character.

**Root cause:** Each keystroke triggered a brand-new React Query key (`['user-search', params]`). Before the new request finished, the component saw `isLoading === true` and rendered the full-screen loading state. That unmounted the input, so when results arrived the browser rebuilt the field without focus. The debounce itself wasn’t at fault—the stale data vanished between requests.

**Fix:**
- Keep previous results visible during fetches by setting `placeholderData: (prev) => prev` (React Query v5) so the data isn’t torn down between searches.
- Track whether initial data has landed (`hasInitialData`) and only show the full-screen loading view before that first payload. Subsequent refetches now show a subtle “Updating results…” inline message instead of wiping the UI.
- Optional: debounce inputs (250 ms) to avoid excessive requests, but the real fix is persisting UI state across refetches.

### Related reading

- Implementation details: see the “Client Hook” and “UI Integration” sections in [Mock Search API](../reference/mock-search-api.md).
- React Query docs on [placeholder data](https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-data).
