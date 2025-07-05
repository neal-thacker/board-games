import React, { useState, useEffect } from 'react';

export default function GameForm({ initialData = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [playerMin, setPlayerMin] = useState(initialData.player_min || '');
  const [playerMax, setPlayerMax] = useState(initialData.player_max || '');
  const [estimatedTime, setEstimatedTime] = useState(initialData.estimated_time || '');
  const [minAge, setMinAge] = useState(initialData.min_age || '');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!playerMin || isNaN(playerMin) || parseInt(playerMin) < 1) {
      setError('Minimum players is required and must be at least 1');
      return;
    }
    setError(null);
    onSubmit({
      name,
      description,
      player_min: playerMin ? parseInt(playerMin) : null,
      player_max: playerMax ? parseInt(playerMax) : null,
      estimated_time: estimatedTime ? parseInt(estimatedTime) : null,
      min_age: minAge ? parseInt(minAge) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto bg-white p-6 rounded shadow">
      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Minimum Players</label>
        <input
          type="number"
          min="1"
          className="w-full border rounded px-3 py-2"
          value={playerMin}
          onChange={e => setPlayerMin(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Maximum Players</label>
        <input
          type="number"
          min="1"
          className="w-full border rounded px-3 py-2"
          value={playerMax}
          onChange={e => setPlayerMax(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Estimated Time (minutes)</label>
        <input
          type="number"
          min="1"
          className="w-full border rounded px-3 py-2"
          value={estimatedTime}
          onChange={e => setEstimatedTime(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Minimum Age</label>
        <input
          type="number"
          min="0"
          className="w-full border rounded px-3 py-2"
          value={minAge}
          onChange={e => setMinAge(e.target.value)}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Save</button>
      </div>
    </form>
  );
}
