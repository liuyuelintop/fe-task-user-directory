# Technical Q&A Bank

> **Audience:** Interview dry runs, panels  
> **Use when:** You expect follow-up questions on the User Directory build  
> **Prep time:** 15–30 minutes to skim and rehearse

Each answer references decisions made in the speed tutorial. Tailor the wording to match your own voice before the interview.

---

## Technical Architecture

### Q1: Why React Query over other state management?

> React Query solves server state specifically—caching, deduplication, loading/error states—all without the ceremony of Redux. Our data is mostly server state, so React Query keeps the code lean while giving us background updates and retries for free.

### Q2: Why split API calls, hooks, and components?

> The API module handles fetch + transform, the hook owns React Query config, and the component stays focused on presentation. This separation improves testability, reusability, and change isolation.

### Q3: Why use a fixed seed?

> Randomuser without a seed returns different users per request, which breaks favorites. A seed keeps results stable, making debugging and persistence straightforward.

---

## React Query Focus

### Q4: Explain your React Query configuration.

> I set `staleTime` to 30 minutes to keep data “fresh” through the interview and disabled focus/reconnect refetch so favorites don’t desync when the tab changes. We can still trigger manual refetches when needed.

### Q5: How does caching work here?

> Data is cached under `['users']`. Remounting components or navigating routes reuses the cache instantly. After 30 minutes it becomes stale but still serves cached data until a refetch succeeds.

### Q6: Difference between `staleTime` and `cacheTime`?

> `staleTime` governs freshness (30 minutes). `cacheTime` controls garbage collection for unused queries (defaults to 5 minutes). Data can be stale yet still cached.

---

## TypeScript & Safety

### Q7: Why the chosen `User` interface?

> I model only the fields the UI renders—`login.uuid`, name breakdown, email, picture, nationality. The transform reshapes the raw API into that interface so components stay strongly typed.

### Q8: How do you justify the `any` in the transform?

> Randomuser has no types. I cast the raw payload to `any`, immediately normalize it, and surface the typed object. In production I’d add runtime validation with `zod` or generate API types.

### Q9: Why disable `no-explicit-any`?

> To keep the speed build frictionless. I’d re-enable it later once I add API typings or validation, but during the interview this pragmatic exception keeps momentum.

---

## Component Architecture

### Q10: How are loading and error states handled?

> React Query exposes `isLoading`/`isError`. I return early with a loading message or error prompt, keeping the main render free of branching.

### Q11: Why localStorage for favorites?

> Favorites are personal to the user and don’t require server sync for the challenge. LocalStorage is instant, requires no backend, and keeps state across refreshes.

### Q12: How do you prevent favorite mismatches?

> Deterministic data (`seed`, `login.uuid`) plus React Query settings that avoid surprise refetches. The badge counts the intersection of stored IDs and loaded users.

---

## Performance & Optimization

### Q13: How did you handle performance?

> Memoize derived lists (`filteredUsers`, `visibleFavoritesCount`), keep components small, and avoid unnecessary renders. For larger datasets I’d add virtualization.

### Q14: What would you change for production?

> Add runtime validation, better error boundaries, pagination/infinite scroll, accessibility audits, analytics, and CI. The speed build focuses on core UX; production would add robustness.

### Q15: Handling 10,000+ users?

> Implement pagination/infinite queries, virtualized list rendering, server filtering, and potentially background prefetching with React Query.

---

## Testing

### Q16: How would you test the app?

> Unit-test hooks (mock fetch). Component-test `UserDirectory` with MSW for search/filter flows. Integration-test favorites persistence with Playwright/Cypress.

### Q17: How do you test favorites?

> Mock localStorage, render the directory, toggle a favorite, assert badge/tab counts, reload, and confirm persistence. Also test intersection logic when the dataset changes.

---

## State Management

### Q18: Why not Redux or Context?

> The heavy lifting is server state. React Query already handles caching and fetching. Redux/Context would add ceremony without solving the core problem better.

### Q19: How do you synchronize state across components?

> React Query keeps server state coordinated. `useFavorites` centralizes client state so any component using it reads from the same source of truth.

---

## Code Quality

### Q20: What principles guided your code?

> Separation of concerns, small composable components, clear naming, and guarded side effects. TypeScript provides compile-time safety.

### Q21: How do you ensure maintainability?

> Consistent file structure, typed boundaries, minimal props, and predictable hook APIs. Future changes touch isolated modules instead of tangling everything together.

---

## Future Improvements

### Q22: What’s next for this codebase?

> Broaden test coverage, add `zod` validation, build pagination, improve accessibility, hook in analytics/monitoring, and set up CI/CD pipelines.

### Q23: How would you scale the app?

> SSR or SSG for faster first paint, API caching, authentication, database-backed favorites, observability pipelines, and tuned infrastructure (CDN, rate limiting).

---

## Quick Reference

| Topic | One-liner |
| --- | --- |
| React Query | Purpose-built for server state, handles cache + refetch |
| Architecture | API → hook → component layering for clarity |
| Favorites | Deterministic IDs + intersection math prevent drift |
| Performance | Memo filtering, plan for virtualization at scale |
| Testing | Hooks + components + E2E with MSW / Playwright |
| Production | Validation, pagination, accessibility, observability |

### Cross-links

- For narrative scripts, open [Communication Scripts](communication-scripts.md).  
- For deeper architecture talking points, use the [Senior Playbook](senior-playbook.md).
