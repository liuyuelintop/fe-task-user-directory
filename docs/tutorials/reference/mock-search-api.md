# Mock Search API (Bonus Requirement)

> **Audience:** Interview follow-up, architecture deep dives  
> **Use when:** You need to demonstrate how the User Directory would call a backend search API  
> **Prereqs:** Familiar with the core build, React Query, Next.js App Router

The bonus question asks: _“If search talked to an API, how would you design and implement it?”_  
This guide explains the layers required to stand up a fake-yet-realistic API inside the Next.js app and integrate it from the client.

---

## 1. Requirements Recap

- Provide a search endpoint the UI can call (`/api/users/search`).
- Keep responses deterministic so favorites and filters remain stable.
- Support the same filters exposed in the UI (`q`, `nationality`, pagination) and simulate real API behavior (latency, error codes).
- Reuse existing user transformations so schema stays consistent.

---

## 2. Architecture at a Glance

| Layer | Responsibility | Notes |
| --- | --- | --- |
| API Route (`app/api/users/search/route.ts`) | Parse query params, run search, return JSON | Mimics future backend contract |
| Mock Data Store (`lib/mockUserStore.ts`) | Load and cache seeded dataset | Ensures deterministic results |
| Client Hook (`hooks/useUserSearch.ts`) | Call the endpoint via React Query | Replaces local `useMemo` filtering |
| UI (`components/UserDirectory.tsx`) | Bind inputs to the search hook | Keeps component logic thin |

---

## 3. Server Route Implementation

Create `app/api/users/search/route.ts` to expose the mock endpoint:

```ts
import { NextRequest } from 'next/server';
import { getMockUsers } from '@/lib/mockUserStore';

const DEFAULT_PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  await wait(200); // simulate network latency

  const { search, nationality, page, pageSize } = parseParams(request);
  const dataset = await getMockUsers();
  const filtered = filterUsers(dataset, { search, nationality });

  const start = (page - 1) * pageSize;
  const results = filtered.slice(start, start + pageSize);

  return Response.json({
    data: results,
    meta: {
      total: filtered.length,
      page,
      pageSize,
      hasMore: start + pageSize < filtered.length,
    },
  });
}

function parseParams(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  const nationality = request.nextUrl.searchParams.get('nationality')?.toUpperCase() ?? 'ALL';
  const page = Number(request.nextUrl.searchParams.get('page') ?? '1');
  const pageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE));
  return { search, nationality, page, pageSize };
}

function filterUsers(users: User[], params: { search: string; nationality: string }) {
  return users.filter(user => {
    const matchesSearch = !params.search || user.name.full.toLowerCase().includes(params.search);
    const matchesNationality =
      params.nationality === 'ALL' || user.nationality.toUpperCase() === params.nationality;
    return matchesSearch && matchesNationality;
  });
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

**Key points**
- Input parsing lives in helpers to keep the route readable.
- The response mirrors a production contract (`data` + `meta` block), making the front end future-proof.
- Latency simulation (`wait`) mimics real-world lag during demos/tests.

---

## 4. Mock Data Store

Keep the dataset deterministic and reusable across requests. Create `lib/mockUserStore.ts`:

```ts
import { fetchUsers } from '@/lib/api'; // existing transformer
import type { User } from '@/types';

let cachedUsers: User[] | null = null;

export async function getMockUsers(): Promise<User[]> {
  if (!cachedUsers) {
    cachedUsers = await hydrateUsers();
  }
  return cachedUsers;
}

async function hydrateUsers(): Promise<User[]> {
  // Option A: load from a local JSON fixture
  // return usersFromFixture;

  // Option B: fetch once using the seeded API leveraged elsewhere
  return fetchUsers();
}

export function resetMockUsers() {
  cachedUsers = null;
}
```

- Share the existing `fetchUsers` transformer to guarantee schema parity with the live app.
- Expose `resetMockUsers` so tests can reset state.

---

## 5. Client Hook

Replace local filtering with a React Query hook that calls the new endpoint. Add `hooks/useUserSearch.ts`:

### Why `useDebounce`?

When users type, you don’t want to fire a network request on every keystroke. A small debounce waits for input to “settle” before running the query. Here’s a lightweight utility you can drop into `hooks/useDebounce.ts`:

```ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cancel the timeout if value changes again
  }, [value, delay]);

  return debouncedValue;
}
```

This hook simply mirrors the latest value after 250 ms of inactivity; you can reuse it anywhere you need throttled input.

```ts
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce'; // simple 250ms debounce util

interface UserSearchParams {
  q: string;
  nationality: string;
  page: number;
}

interface SearchResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export function useUserSearch({ q, nationality, page }: UserSearchParams) {
  const debounced = useDebounce({ q, nationality, page }, 250);

  return useQuery({
    queryKey: ['user-search', debounced],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        q: debounced.q ?? '',
        nationality: debounced.nationality ?? 'ALL',
        page: String(debounced.page ?? 1),
        pageSize: '20',
      });

      const response = await fetch(`/api/users/search?${params.toString()}`, { signal });
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      return (await response.json()) as SearchResponse;
    },
    keepPreviousData: true,
    staleTime: 60_000,
    enabled: Boolean(debounced.q.trim()) || debounced.nationality !== 'ALL',
  });
}
```

### How `useQuery` is configured

- `queryKey`: Uniquely identifies the request. When `debounced` changes, React Query knows to rerun the `queryFn` and cache the result under that key.
- `queryFn`: Actual fetch. React Query injects an `AbortSignal` (`signal`) so if the component unmounts or inputs change mid-request, the fetch is cancelled cleanly.
- `keepPreviousData: true`: While new results load (e.g., page changes), continue showing the previous data to avoid UI flicker.
- `staleTime: 60_000`: Treat results as fresh for 60 seconds; prevents re-fetching on focus or remount during that window.
- `enabled`: Skip hitting the API until the user has typed something or chosen a specific nationality—saving unnecessary requests.

> **Tip:** Adjust `pageSize` or add additional params (e.g., sort) as your UI grows; just make sure to include them in both the URL and the `queryKey`.

---

## 6. UI Integration

Once the hook exists, wire it into `components/UserDirectory.tsx` (or wherever your directory lives):

1. **Import the new hook and debounce helper (if used directly)**  
   ```ts
   import { useUserSearch } from '@/hooks/useUserSearch';
   ```

2. **Track pagination state (optional but recommended)**  
   ```ts
   const [page, setPage] = useState(1);
   ```
   Reset `page` to `1` whenever `searchTerm` or `selectedNationality` changes so you don’t request a non-existent page.

3. **Swap the data source**  
   Replace the existing `const { data: users, ... } = useUsers()` (plus memo filtering) with the hook call:

```tsx
const { data, isLoading, isError } = useUserSearch({
  q: searchTerm,
  nationality: selectedNationality,
  page,
});

const users = data?.data ?? [];
const total = data?.meta.total ?? 0;
const hasMore = data?.meta.hasMore ?? false;
```

4. **Update derived UI pieces**  
   - The “results count” line should use `total` instead of `users.length` so it reflects the full dataset size.  
   - If you add pagination controls, use `page`, `setPage`, and `hasMore` to enable/disable next/previous buttons.

5. **Remove client-side filter memo**  
   You no longer need `useMemo` blocks that filter `users`. Keep any presentation logic (e.g., empty state messages, favorites intersection) but source their data from the API results.

6. **Favorites compatibility**  
   The favorites badge still works: intersect the `favoriteIds` with the `users` returned from the API. Because the backend already filters by search/nationality, the intersection operates on the same limited data set as before.

7. **Handle loading/error states**  
   Existing `isLoading` / `isError` branches continue to work. Now they represent actual network latency and failure scenarios, so it’s worth tweaking copy to mention retrying, or adding a “Refresh” button that calls `refetch`.

> **Double-check:** Anywhere you previously referenced `users?.length` or the memoized `filteredUsers` array should now look at `users` (from the API) and the metadata the backend returns.

---

## 7. Testing Strategy

- **API route tests:** Use Vitest or Jest to call the `GET` handler directly and assert filtering/pagination.
- **Client tests:** With MSW, stub `rest.get('/api/users/search', …)` to return fixture data and cover loading, success, and error states.
- **Integration:** End-to-end tests can hit the Next.js route for full-stack verification while still using deterministic data.

---

## 8. Why This Scales

- Front end exercises realistic fetch + error paths, easing the eventual swap to a real backend.
- Deterministic data keeps favorites and search aligned, avoiding the original flakiness.
- The API response schema doubles as documentation for backend teams.
- Tests remain reliable because both the mock store and route are under your control.

---

## Cross-links

- Core build context: [Phase 2 – Working UI](../core/03-ui-build.md) and [Phase 3 – Refinement](../core/04-refinement.md).  
- Troubleshooting favorites vs. data mismatch: `docs/known-issues/favorites-data-mismatch.md`.  
- Communication tips when presenting this design: [Interview Communication Scripts](../interview/communication-scripts.md).
