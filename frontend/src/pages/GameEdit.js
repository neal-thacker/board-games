import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameForm from './GameForm';

export default function GameEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/games/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch game');
        return res.json();
      })
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (updated) => {
    fetch(`http://localhost:8000/api/games/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update game');
        return res.json();
      })
      .then(() => navigate('/library'))
      .catch(err => setError(err.message));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Game</h2>
      <GameForm initialData={game} onSubmit={handleUpdate} onCancel={() => navigate('/library')} />
    </main>
  );
}
