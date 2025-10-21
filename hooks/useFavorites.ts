// hooks/useFavorites.ts

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'user-favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
      } catch {
        // ignore storage errors for this tutorial
      }
    }
  }, [favoriteIds]);

  const toggleFavorite = (userId: string) => {
    setFavoriteIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const isFavorite = (userId: string) => favoriteIds.includes(userId);

  return { favoriteIds, toggleFavorite, isFavorite };
}

