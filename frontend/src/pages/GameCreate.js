import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'flowbite-react';
import GameForm from './GameForm';
import { apiFetch } from '../api';

export default function GameCreate() {
  const navigate = useNavigate();

  const handleCreate = (game) => {
    // Separate tags from the rest of the game data
    const { tags, ...gameData } = game;
    apiFetch('/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create game');
        return res.json();
      })
      .then(gameRes => {
        // Attach tags after game is created
        if (tags && tags.length > 0) {
          Promise.all(tags.map(tag =>
            apiFetch(`/games/${gameRes.id}/tags/${tag.id}`, { method: 'POST' })
          )).then(() => navigate('/library'));
        } else {
          navigate('/library');
        }
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-3">Add New Game</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add a new board game to your collection. Fill in the details below to keep track of your games.
          </p>
        </div>

        {/* Form Section */}
        <GameForm onSubmit={handleCreate} onCancel={() => navigate('/library')} />
      </div>
    </div>
  );
}
