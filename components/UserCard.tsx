// components/UserCard.tsx

import { User } from "@/types";

interface UserCardProps {
  user: User;
  isFavorite?: boolean;
  onToggleFavorite?: (userId: string) => void;
}

export function UserCard({
  user,
  isFavorite,
  onToggleFavorite,
}: UserCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow relative">
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(user.id)}
          className="absolute top-2 right-2 text-2xl hover:scale-110 transition-transform"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}
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
  );
}
