import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from 'flowbite-react';

function GameCard({ game }) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/games/${game.id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (game.onDelete) {
      game.onDelete(game.id);
    }
  };

  return (
    <Card 
      className="w-full h-full cursor-pointer hover:shadow-lg transition-all duration-200 border-purple-400 hover:border-purple-400"
      onClick={() => navigate(`/games/${game.id}`)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-none mb-3">
          <h5 className="text-xl font-bold tracking-tight text-purple-700 text-center line-clamp-2">
            {game.name}
          </h5>
        </div>

        {/* Content - grows to fill space */}
        <div className="flex-grow flex flex-col justify-between">
          {/* Description */}
          <div className="mb-4">
            {game.description && (
              <p className="text-gray-600 text-sm text-center line-clamp-3">
                {game.description}
              </p>
            )}
          </div>

          {/* Game details */}
          <div className="flex-none space-y-3">
            {/* Player count and play time */}
            <div className="flex justify-center gap-2 flex-wrap">
              {(game.min_players || game.max_players) && (
                <Badge color="purple" size="sm">
                  {game.min_players === game.max_players 
                    ? `${game.min_players} ${game.min_players === 1 ? 'player' : 'players'}`
                    : `${game.min_players || '?'}-${game.max_players || '?'} players`
                  }
                </Badge>
              )}
              {game.play_time && (
                <Badge color="indigo" size="sm">
                  {game.play_time} min
                </Badge>
              )}
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="flex justify-center gap-1 flex-wrap">
                {game.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} color="gray" size="xs">
                    {tag.name}
                  </Badge>
                ))}
                {game.tags.length > 3 && (
                  <Badge color="gray" size="xs">
                    +{game.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center gap-2 pt-2">
              <Button
                size="xs"
                color="purple"
                onClick={handleEdit}
                className="px-3"
              >
                Edit
              </Button>
              <Button
                size="xs"
                color="failure"
                onClick={handleDelete}
                className="px-3"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default GameCard;
