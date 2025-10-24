# Phase 1: Types & Data Layer (5–15 min)

> **Audience:** Interview run-through  
> **Time:** 10 minutes  
> **Prereqs:** Comfortable with TypeScript interfaces and React Query setup

Lock down deterministic data early so favorites and state stay predictable later.

## Step 4 — Define the `User` contract (2 min)

Create `types/index.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name: {
    first: string;
    last: string;
    full: string;
  };
  picture: {
    large: string;
  };
  nationality: string;
}
```

> **Interview script:** “I’m defining only the fields I render. In production I’d separate API response types and validate with something like `zod`, but for a speed build I optimize for clarity.”

## Step 5 — Fetch & transform users (3 min)

Create `lib/api.ts`:

```typescript
import { User } from '@/types';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://randomuser.me/api/?results=50&seed=user-directory');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();

  return data.results.map((apiUser: any) => ({
    id: apiUser.login.uuid,
    email: apiUser.email,
    name: {
      first: apiUser.name.first,
      last: apiUser.name.last,
      full: `${apiUser.name.first} ${apiUser.name.last}`,
    },
    picture: { large: apiUser.picture.large },
    nationality: apiUser.nat,
  }));
}
```

Why the seed? It keeps the dataset stable so local favorites don’t point at vanished users later. `login.uuid` is the most reliable unique identifier the API exposes.

## Step 6 — Wire `useUsers` (2 min)

Create `hooks/useUsers.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
```

- `staleTime` keeps data “fresh” for 30 minutes so React Query doesn’t surprise-refetch mid-interview.
- Disabling focus/reconnect refetch avoids dataset swaps that break favorites.

## Step 7 — Add providers (3 min)

Create `app/providers.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## Step 8 — Hook into the layout (2 min)

Replace `app/layout.tsx` with:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'User Directory',
  description: 'Search and filter users',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

> ✅ **Checkpoint:** Types, API, React Query providers in place.

### Next

- Continue to [Phase 2: Working UI](03-ui-build.md).
- Need rationale for React Query choices? See [Interview Q&A](../interview/qa.md#q4-explain-your-react-query-configuration-why-these-specific-settings).*** End Patch
