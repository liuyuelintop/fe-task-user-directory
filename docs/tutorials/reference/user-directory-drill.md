# User Directory Drill

> **Audience:** Practice reps after finishing the tutorial  
> **Use when:** You want a quick refresher without rereading every phase  
> **Prep time:** 1 minute to set intent

## Mindset

- Build in thin layers; verify after each.  
- Follow the same sequence every time to build muscle memory.  
- No copy/paste—work from this checklist and your acceptance tests.

## Prereqs

- `useUsers` contract: `{ data: User[] | undefined; isLoading; isError }`.  
- `useFavorites` API: `favoriteIds`, `toggleFavorite(id)`, `isFavorite(id)`.  
- `User` shape: `id`, `name.full`, `email`, `picture.large`, `nationality`.

## Practice loop

1. Core data + basic list.  
2. Search + nationality filters.  
3. Extract `UserCard`.  
4. Favorites tab + intersection count.  
5. UX polish (empty states, clear filters).  
6. Performance clarity (memo derived data).  
7. Accessibility pass (labels, roles).  
> Target 10–15 minutes by step 3, 20–25 minutes by step 5.

## Step-by-step reference

1. **Component shell:** `'use client'`, import hooks, render container.  
2. **Base state:** call `useUsers`, track `searchTerm`, `selectedNationality`, `activeTab`.  
3. **Early returns:** handle loading/error with centered messages.  
4. **Derived nationalities:** memoize unique sorted values.  
5. **Filtering pipeline:** memoize search + nationality (AND logic).  
6. **UI:** header, controls, counts, grid.  
7. **Extract `UserCard`:** pass `user` only.  
8. **Favorites:** add hook, tabs, intersection count, pass `isFavorite`/`onToggleFavorite`.  
9. **Empty states:** differentiate favorites vs. general empty state, add “Clear Filters”.  
10. **Performance/a11y:** memo intersections, label controls, add ARIA to buttons.

## State map

- **State:** `searchTerm`, `selectedNationality`, `activeTab`, `favoriteIds`.  
- **Derived:** `nationalities`, `filteredUsers`, `visibleFavoritesCount`.

## Acceptance tests

- Grid renders 50 users without errors.  
- Search “john” works; case-insensitive.  
- Nationality filter narrows results; “All” resets.  
- Search + filter combine (AND).  
- Empty state message + “Clear Filters” reset.  
- Favorites toggle updates card + tab; badge equals visible favorites; persists after reload.

## Timed targets

- Base list: 5–7 min.  
- Filters: +5 min.  
- UserCard extraction: +3 min.  
- Favorites/tab/badge: +8–10 min.  
- Empty/polish: +3 min.  
- Total: ~25–30 min; aim to reduce with repetition.

## Variations

- Swap filter order and confirm results remain identical.  
- Add a manual `refetch` button and explain stability trade-offs.  
- Debounce search input (250ms).  
- Render nationality chips from derived counts.

### Cross-links

- Need detailed instructions? Return to [Core Phases](../core/index.md).  
- Check behavior? Use [Checklists](../core/05-checklists.md).  
- Recording your narration? Review [Communication Scripts](../interview/communication-scripts.md).
