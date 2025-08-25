import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { Card, Badge, Button, Spinner, Alert } from 'flowbite-react';
import { HiArrowLeft, HiPencil, HiTrash } from 'react-icons/hi';

function GameView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/games/${id}`);
        if (!res.ok) {
          throw new Error('Game not found');
        }
        const gameData = await res.json();
        setGame(gameData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGame();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/games/${game.id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    
    try {
      const res = await apiFetch(`/games/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete game');
      
      // Navigate back to library after successful deletion
      navigate('/library');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate('/library');
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center text-center w-full max-w-7xl mx-auto space-y-8 p-4">
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-600">Loading game...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center text-center w-full max-w-7xl mx-auto space-y-8 p-4">
        <Alert color="failure" className="w-full max-w-md">
          <span className="font-medium">Error:</span> {error}
        </Alert>
        <Button onClick={handleBack} color="light">
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center text-center w-full max-w-7xl mx-auto space-y-8 p-4">
        <Alert color="warning" className="w-full max-w-md">
          <span className="font-medium">Game not found</span>
        </Alert>
        <Button onClick={handleBack} color="light">
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* Header with back button */}
      <div className="w-full flex items-center justify-between">
        <Button onClick={handleBack} color="light" size="sm">
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <Button onClick={handleEdit} color="purple" size="sm">
            <HiPencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={handleDelete} color="light" size="sm">
            <HiTrash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Game details card */}
      <Card className="w-full">
        <div className="space-y-6">
          {/* Game title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              {game.name}
            </h1>
          </div>

          {/* Game statistics */}
          <div className="flex justify-center gap-4 flex-wrap">
            {(game.player_min || game.player_max) && (
              <Badge color="purple" size="lg" className="px-4 py-2">
                <span className="text-sm font-medium">
                  {game.player_min === game.player_max 
                    ? `${game.player_min} ${game.player_min === 1 ? 'player' : 'players'}`
                    : `${game.player_min || '?'}-${game.player_max || '?'} players`
                  }
                </span>
              </Badge>
            )}
            {game.estimated_time && (
              <Badge color="indigo" size="lg" className="px-4 py-2">
                <span className="text-sm font-medium">{game.estimated_time} minutes</span>
              </Badge>
            )}
            {game.min_age && (
              <Badge color="green" size="lg" className="px-4 py-2">
                <span className="text-sm font-medium">Ages {game.min_age}+</span>
              </Badge>
            )}
          </div>

          {/* Description */}
          {game.description && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {game.description}
              </p>
            </div>
          )}

          {game.tags && game.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Tags</h3>
            <div className="flex justify-center gap-2 flex-wrap">
            {game.tags.map((tag) => {
              const colors = ['purple', 'blue', 'green', 'red', 'yellow', 'indigo', 'pink', 'gray'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              return (
              <Badge key={tag.id} color={randomColor} size="lg" className="px-3 py-1">
                {tag.name}
              </Badge>
              );
            })}
            </div>
          </div>
          )}
        </div>
      </Card>
    </main>
  );
}

export default GameView;
