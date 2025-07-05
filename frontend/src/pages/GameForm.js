import React, { useState, useEffect } from 'react';

export default function GameForm({ initialData = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [playerMin, setPlayerMin] = useState(initialData.player_min || '');
  const [playerMax, setPlayerMax] = useState(initialData.player_max || '');
  const [estimatedTime, setEstimatedTime] = useState(initialData.estimated_time || '');
  const [minAge, setMinAge] = useState(initialData.min_age || '');
  const [tags, setTags] = useState(initialData.tags || []);
  const [tagQuery, setTagQuery] = useState('');
  const [tagOptions, setTagOptions] = useState([]);
  const [tagSearchLoading, setTagSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tagQuery.trim() === '') {
      setTagOptions([]);
      return;
    }
    setTagSearchLoading(true);
    fetch(`http://localhost:8000/api/tags?search=${encodeURIComponent(tagQuery)}`)
      .then(res => res.json())
      .then(data => {
        setTagOptions(data.filter(tag => !tags.some(t => t.id === tag.id)));
        setTagSearchLoading(false);
      });
  }, [tagQuery, tags]);

  const handleAddTag = (tag) => {
    setTags([...tags, tag]);
    setTagQuery('');
    setTagOptions([]);
  };

  const handleRemoveTag = (tagId) => {
    setTags(tags.filter(t => t.id !== tagId));
  };

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
      tags,
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
      <div>
        <label className="block font-semibold mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag.id} className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              {tag.name}
              <button type="button" className="ml-1 text-xs text-red-500 hover:text-red-700" onClick={() => handleRemoveTag(tag.id)}>&times;</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Search tags..."
          value={tagQuery}
          onChange={e => setTagQuery(e.target.value)}
        />
        {tagSearchLoading && <div className="text-xs text-gray-500">Searching...</div>}
        {tagOptions.length > 0 && (
          <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
            {tagOptions.map(tag => (
              <li key={tag.id}>
                <button type="button" className="w-full text-left px-3 py-2 hover:bg-purple-100" onClick={() => handleAddTag(tag)}>
                  {tag.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Save</button>
      </div>
    </form>
  );
}
