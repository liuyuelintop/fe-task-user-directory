# Favorites vs Data Mismatch

Summary: Favorites persist in `localStorage`, but the user dataset fetched from `randomuser.me` changes over time, causing favorites to reference users that are not present in the current dataset.

Tutorial context: This surfaced during the speed build flow — specifically [Phase 1: Data Layer](../tutorials/core/02-data-layer.md) (API + React Query) and [Phase 3: Refinement](../tutorials/core/04-refinement.md) when favorites are introduced.

Impact
- Favorites badge may show a count that doesn’t match visible favorites.
- Favorites tab can be empty even when there are saved favorite IDs.
- User experience confusion; no data loss, but perceived inconsistency.

Reproduction Steps
1. Load the app, favorite 1–2 users.
2. Trigger a refetch (focus window/reconnect) or reload later.
3. Observe: favorites count may not match visible favorites; previously favorited users may be missing.

Root Cause
- Unseeded API: `https://randomuser.me/api/?results=50` returns a new random sample each fetch.
- Default React Query behavior: refetches on window focus/reconnect, so the dataset changes at “unknown” times.
- Favorites persistence: `useFavorites` stores `user.id`s in `localStorage` across sessions.
- No reconciliation: The UI filters the current `users` by stored IDs, but many IDs are not in the new sample.

Contributing Factors
- Identifier choice ties favorites to ephemeral data samples.
- No seed or stable query parameters → non-deterministic data across fetches.
- Defaults in React Query optimize freshness over stability in demos.

Reflection (from the speed build)
- Context: The tutorial prioritizes speed — get working UI quickly, inline transforms, and default settings (see [Core Build Guide](../tutorials/core/index.md)).
- Why it happened: Non-deterministic data + default refetch + persistent favorites = cross-boundary mismatch.
- Speed tradeoffs: Used defaults (no seed, default React Query) and added persistence without aligning it to server data lifecycle.
- Lessons:
  - If you persist client state tied to server entities, ensure deterministic server data (seed, stable IDs) or capture snapshots.
  - Tune React Query (`staleTime`, `refetchOnWindowFocus`, `refetchOnReconnect`) when stability matters more than constant freshness.
  - Document known issues promptly; fix in a focused branch to keep history clean.

Options Considered
1) Stabilize dataset
   - Use a fixed `seed` param in the API request.
   - Prefer `login.uuid` as `id` for clarity and uniqueness.

2) Reduce surprise refetches
   - Set `staleTime` (e.g., 30m) and disable `refetchOnWindowFocus`/`refetchOnReconnect`.

3) Reconcile favorites in UI
   - Compute favorites count as intersection of `favoriteIds` and current `users`.
   - Optionally prune missing IDs on dataset changes or label them as “missing”.

4) Persist favorite snapshots
   - Store minimal user snapshots with the favorite (name, picture, email) to render even when missing from the current dataset.

Chosen Fix (this branch’s scope)
- Add a fixed seed and use `login.uuid` for `id`.
- Tame refetching via React Query options.
- Compute the favorites badge using the intersection with current users.

Test Plan
- Favorite a user; reload and refocus the window; ensure the favorite still appears.
- Verify favorites count equals visible favorites.
- Ensure no console errors and responsive behavior unchanged.
