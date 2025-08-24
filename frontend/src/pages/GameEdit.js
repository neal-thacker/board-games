import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import GameForm from './GameForm';

export default function GameEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/games/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch game');
        return res.json();
      })
      .then(data => {
        // Ensure tags is always an array of {id, name}
        setGame({ ...data, tags: Array.isArray(data.tags) ? data.tags : [] });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (updated) => {
    // Separate tags from the rest of the game data
    const { tags, ...gameData } = updated;
    apiFetch(`/games/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update game');
        return res.json();
      })
      .then(gameRes => {
        // Update tags via attach/detach endpoints
        const tagIds = tags.map(t => t.id);
        // 1. Detach all existing tags
        const detachAll = (gameRes.tags || []).filter(t => !tagIds.includes(t.id));
        const attachAll = tagIds.filter(id => !(gameRes.tags || []).some(t => t.id === id));
        // Detach removed tags
        Promise.all(detachAll.map(tag =>
          apiFetch(`/games/${id}/tags/${tag.id}`, { method: 'DELETE' })
        )).then(() => {
          // Attach new tags
          Promise.all(attachAll.map(tagId =>
            apiFetch(`/games/${id}/tags/${tagId}`, { method: 'POST' })
          )).then(() => navigate('/library'));
        });
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Game</h2>
      <GameForm initialData={game} onSubmit={handleUpdate} onCancel={() => navigate(`/games/${id}`)} />
    </main>
  );
}
