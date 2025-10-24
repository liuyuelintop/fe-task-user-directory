# Phase 3: Refinement (35–50 min)

> **Audience:** Interview run-through  
> **Time:** 15 minutes  
> **Prereqs:** Comfortable refactoring React components, localStorage basics

Choose the polish that best sells your strengths. The path below extracts the card and layers in favorites.

## Step 12 — Extract `UserCard` (5 min)

Create `components/UserCard.tsx`:

```typescript
import { User } from '@/types';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <img
        src={user.picture.large}
        alt={user.name.full}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="font-semibold text-lg text-center mb-2">{user.name.full}</h3>
      <p className="text-gray-600 text-center text-sm mb-2 break-all">{user.email}</p>
      <p className="text-gray-500 text-center text-xs">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-full">{user.nationality.toUpperCase()}</span>
      </p>
    </div>
  );
}
```

Then import it inside `UserDirectory` and swap the inline markup:

```tsx
import { UserCard } from '@/components/UserCard';
// ...
{filteredUsers.map(user => (
  <UserCard key={user.id} user={user} />
))}
```

## Step 13 — Add favorites (10 min)

Wire the favorites hook and tabs inside `UserDirectory`:

```typescript
import { useFavorites } from '@/hooks/useFavorites';

const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

const visibleFavoritesCount = useMemo(() => {
  if (!users) return 0;
  const visible = new Set(users.map(user => user.id));
  return favoriteIds.filter(id => visible.has(id)).length;
}, [users, favoriteIds]);
```

Update the filter pipeline so favorites respect the intersection:

```typescript
let results = users;

if (activeTab === 'favorites') {
  results = results.filter(user => favoriteIds.includes(user.id));
}

const filteredUsers = useMemo(() => {
  if (!results) return [];
  // existing search + nationality logic
}, [results, searchTerm, selectedNationality]);
```

Render tabs plus the badge:

```tsx
const tabClass = (isActive: boolean) =>
  isActive
    ? 'px-4 py-2 rounded-lg bg-blue-600 text-white'
    : 'px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200';

<div className="mb-4 flex gap-2">
  <button
    type="button"
    onClick={() => setActiveTab('all')}
    className={tabClass(activeTab === 'all')}
  >
    All ({users?.length ?? 0})
  </button>
  <button
    type="button"
    onClick={() => setActiveTab('favorites')}
    className={tabClass(activeTab === 'favorites')}
  >
    Favorites ({visibleFavoritesCount})
  </button>
</div>
```

Pass favorites props down to `UserCard`:

```tsx
<UserCard
  key={user.id}
  user={user}
  isFavorite={isFavorite(user.id)}
  onToggleFavorite={() => toggleFavorite(user.id)}
/>
```

and extend the component signature accordingly.

> **Stability mantra:** keep a deterministic dataset (API `seed` + `login.uuid`), disable surprise refetches, and calculate the favorites badge as the intersection of stored IDs and loaded users.

## Step 14 — Polish if time allows

- **Empty states:** Distinguish between no favorites and no search results.
- **Clear filters:** Reset search + nationality with one click.
- **Responsiveness:** Confirm grid and tabs look reasonable across breakpoints.

> ✅ **Checkpoint:** Favorites persist and align with the visible dataset.

### Next

- Log progress in [Checklists](05-checklists.md).  
- Need to explain trade-offs? Reference [Favorites Data Mismatch](../troubleshooting/common-issues.md#issue-favorites-vs-data-mismatch).  
- Want to speak to panel expectations? Jump to [Interview Playbooks](../interview/index.md).
