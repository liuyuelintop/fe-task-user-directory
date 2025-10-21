// components/UserDirectory.tsx

'use client';

import { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';

export function UserDirectory() {
  const { data: users, isLoading, isError } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('all');

  // Filter logic INLINE - don't extract to custom hook yet
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(user => {
      // Check if user matches search term (first or last name)
      const matchesSearch = user.name.full
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if user matches selected nationality
      const matchesNationality =
        selectedNationality === 'all' ||
        user.nationality === selectedNationality;

      // Both conditions must be true (AND logic)
      return matchesSearch && matchesNationality;
    });
  }, [users, searchTerm, selectedNationality]);

  // Get unique nationalities INLINE
  const nationalities = useMemo(() => {
    if (!users) return [];
    const unique = [...new Set(users.map(u => u.nationality))];
    return unique.sort();
  }, [users]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Failed to load users. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">User Directory</h1>

      {/* Filters - INLINE, not separate components yet */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Nationality Filter */}
        <select
          value={selectedNationality}
          onChange={(e) => setSelectedNationality(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Nationalities</option>
          {nationalities.map(nat => (
            <option key={nat} value={nat}>
              {nat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredUsers.length} of {users?.length || 0} users
      </div>

      {/* User Grid - Cards INLINE, not separate component yet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            {/* User Image */}
            <img
              src={user.picture.large}
              alt={user.name.full}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />

            {/* User Name */}
            <h3 className="font-semibold text-lg text-center mb-2">
              {user.name.full}
            </h3>

            {/* User Email */}
            <p className="text-gray-600 text-center text-sm mb-2 break-all">
              {user.email}
            </p>

            {/* User Nationality */}
            <p className="text-gray-500 text-center text-xs">
              <span className="inline-block bg-gray-100 px-3 py-1 rounded-full">
                {user.nationality.toUpperCase()}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">No users found</p>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
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