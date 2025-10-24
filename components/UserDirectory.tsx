// components/UserDirectory.tsx

"use client";

import { useState, useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";
import { UserCard } from "./UserCard";
import { useFavorites } from "@/hooks/useFavorites";

export function UserDirectory() {
  const { data: users, isLoading, isError } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("all");
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  // Compute visible favorites count as intersection with current users
  const visibleFavoritesCount = useMemo(() => {
    if (!users) return 0;
    const visibleIds = new Set(users.map((user) => user.id));
    return favoriteIds.filter((id) => visibleIds.has(id)).length;
  }, [users, favoriteIds]);

  // Filter logic INLINE - don't extract to custom hook yet
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let result = users;

    // Filter by tab
    if (activeTab === "favorites") {
      result = result.filter((user) => favoriteIds.includes(user.id));
    }

    // Filter by search and nationality
    return result.filter((user) => {
      const matchesSearch = user.name.full
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesNationality =
        selectedNationality === "all" ||
        user.nationality === selectedNationality;

      return matchesSearch && matchesNationality;
    });
  }, [users, searchTerm, selectedNationality, activeTab, favoriteIds]);

  // Get unique nationalities INLINE
  const nationalities = useMemo(() => {
    if (!users) return [];
    const unique = [...new Set(users.map((u) => u.nationality))];
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

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Users ({users?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "favorites"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Favorites ({visibleFavoritesCount})
        </button>
      </div>

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
          {nationalities.map((nat) => (
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

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isFavorite={isFavorite(user.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">
            {activeTab === "favorites" ? "No favorites yet" : "No users found"}
          </p>
          <p className="text-gray-500">
            {activeTab === "favorites"
              ? "Click the heart icon on user cards to add favorites"
              : "Try adjusting your search or filter criteria"}
          </p>
          {activeTab === "all" && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedNationality("all");
              }}
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
