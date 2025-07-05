import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameForm from './GameForm';

export default function GameCreate() {
  const navigate = useNavigate();

  const handleCreate = (game) => {
    fetch('http://localhost:8000/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create game');
        return res.json();
      })
      .then(() => navigate('/library'))
      .catch(err => alert(err.message));
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Add New Game</h2>
      <GameForm onSubmit={handleCreate} onCancel={() => navigate('/library')} />
    </main>
  );
}
