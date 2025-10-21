// lib/api.ts

import { User } from '@/types';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://randomuser.me/api/?results=50');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();

  // Transform API data inline
  return data.results.map((apiUser: any) => ({
    id: apiUser.email,
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