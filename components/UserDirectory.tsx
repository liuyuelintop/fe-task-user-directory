// components/UserDirectory.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserSearch } from '@/hooks/useUserSearch';
import type { User } from '@/types';
import { UserCard } from './UserCard';

const DEFAULT_NATIONALITY = 'ALL';
const EMPTY_USERS: User[] = [];

export function UserDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] =
    useState<string>(DEFAULT_NATIONALITY);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedNationality]);

  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { data, isLoading, isError, refetch, isFetching } = useUserSearch({
    q: searchTerm,
    nationality: selectedNationality,
    page,
  });

  const [hasInitialData, setHasInitialData] = useState(false);

  useEffect(() => {
    if (data && !hasInitialData) {
      setHasInitialData(true);
    }
  }, [data, hasInitialData]);

  const users = data?.data ?? EMPTY_USERS;
  const totalAll = data?.meta.totalAll ?? 0;
  const totalMatching = data?.meta.total ?? 0;
  const nationalities = data?.meta.nationalities ?? [];
  const pageSize = data?.meta.pageSize ?? users.length;
  const hasMore = data?.meta.hasMore ?? false;

  const visibleFavoritesCount = useMemo(() => {
    if (!users.length) return 0;
    const visibleIds = new Set(users.map(user => user.id));
    return favoriteIds.filter(id => visibleIds.has(id)).length;
  }, [users, favoriteIds]);

  const displayedUsers = useMemo(() => {
    if (activeTab === 'favorites') {
      return users.filter(user => favoriteIds.includes(user.id));
    }
    return users;
  }, [users, activeTab, favoriteIds]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedNationality(DEFAULT_NATIONALITY);
    setPage(1);
  };

  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading && !hasInitialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading users…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-600">
            Failed to load users. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">User Directory</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Users ({totalAll})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Favorites ({visibleFavoritesCount})
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder="Search by name…"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedNationality}
          onChange={event => setSelectedNationality(event.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={DEFAULT_NATIONALITY}>All Nationalities</option>
          {nationalities.map(nationality => (
            <option key={nationality} value={nationality.toUpperCase()}>
              {nationality.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 text-gray-600">
        {isFetching ? (
          <span>Updating results…</span>
        ) : (
          <span>
            Showing {displayedUsers.length} of {totalMatching} matching users
            (dataset size: {totalAll})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            isFavorite={isFavorite(user.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {totalMatching > pageSize && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} · Showing {Math.min(page * pageSize, totalMatching)} of{' '}
            {totalMatching}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {displayedUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">
            {activeTab === 'favorites' ? 'No favorites yet' : 'No users found'}
          </p>
          <p className="text-gray-500">
            {activeTab === 'favorites'
              ? 'Click the heart icon on user cards to add favorites.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {activeTab === 'all' && (
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
