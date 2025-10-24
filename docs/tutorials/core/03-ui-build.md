# Phase 2: Working UI (15–35 min)

> **Audience:** Interview run-through  
> **Time:** 20 minutes  
> **Prereqs:** Comfortable with React state, Tailwind utility classes

Ship an end-to-end experience in one pass, then refactor.

## Step 9 — Build `UserDirectory` inline (20 min)

Create `components/UserDirectory.tsx`:

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';

export function UserDirectory() {
  const { data: users, isLoading, isError } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('all');

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(user => {
      const matchesSearch = user.name.full.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNationality = selectedNationality === 'all' || user.nationality === selectedNationality;
      return matchesSearch && matchesNationality;
    });
  }, [users, searchTerm, selectedNationality]);

  const nationalities = useMemo(() => {
    if (!users) return [];
    const unique = [...new Set(users.map(user => user.nationality))];
    return unique.sort();
  }, [users]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load users. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">User Directory</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedNationality}
          onChange={(event) => setSelectedNationality(event.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Nationalities</option>
          {nationalities.map(nationality => (
            <option key={nationality} value={nationality}>
              {nationality.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 text-gray-600">
        Showing {filteredUsers.length} of {users?.length ?? 0} users
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
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
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">No users found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedNationality('all');
            }}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
```

Build everything inline. Once the data flow is correct you can extract components in the next phase.

## Step 10 — Point the homepage at the directory (1 min)

Replace `app/page.tsx` with:

```typescript
import { UserDirectory } from '@/components/UserDirectory';

export default function Home() {
  return <UserDirectory />;
}
```

## Step 11 — Manual test (5 min)

Pause coding and walk the happy path:

1. Page loads with a grid of users.  
2. Search for “john” and “JOHN” (case-insensitive).  
3. Filter by nationality and reset to “All”.  
4. Combine search + nationality.  
5. Force empty state (`xyz123`) and clear filters.  
6. Resize the browser to confirm responsive behavior.

> ✅ **Checkpoint:** All core interactions working before refinement.

### Next

- Continue to [Phase 3: Refinement](04-refinement.md).
- Want quicker scripts while you test? Open [Communication Scripts](../interview/communication-scripts.md).*** End Patch
