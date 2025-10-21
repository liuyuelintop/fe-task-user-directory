// lib/api.ts

import { User } from '@/types';

export async function fetchUsers(): Promise<User[]> {
  // Use a fixed seed to keep dataset stable across refetches
  const response = await fetch('https://randomuser.me/api/?results=50&seed=user-directory');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();

  // Transform API data inline
  return data.results.map((apiUser: any) => ({
    // Use randomuser login.uuid as the stable unique identifier
    id: apiUser.login.uuid,
    email: apiUser.email,
    name: {
      first: apiUser.name.first,
      last: apiUser.name.last,
      full: `${apiUser.name.first} ${apiUser.name.last}`,
    },
    picture: {
      large: apiUser.picture.large,
    },
    nationality: apiUser.nat,
  }));
}
