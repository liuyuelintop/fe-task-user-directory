import { fetchUsers } from '@/lib/api';
import { User } from '@/types';

let cachedUsers: User[] | null = null;

/**
 * Returns a deterministic user dataset that backs the mock search API.
 * The first call hydrates the cache using the existing fetchUsers helper.
 */
export async function getMockUsers(): Promise<User[]> {
  if (!cachedUsers) {
    cachedUsers = await hydrateUsers();
  }
  return cachedUsers;
}

async function hydrateUsers(): Promise<User[]> {
  return fetchUsers();
}

/** Test helper: clears the in-memory dataset so the next call rehydrates it. */
export function resetMockUsers() {
  cachedUsers = null;
}
