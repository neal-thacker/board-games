import React, { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Label, Alert, Badge } from 'flowbite-react';
import { apiFetch } from '../api';

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tagQuery.trim() === '') {
      setTagOptions([]);
      return;
    }
    setTagSearchLoading(true);
    apiFetch(`/tags?search=${encodeURIComponent(tagQuery)}`)
      .then(res => res.json())
      .then(data => {
        setTagOptions(data.filter(tag => !tags.some(t => t.id === tag.id)));
        setTagSearchLoading(false);
      })
      .catch(err => {
        console.error('Failed to search tags:', err);
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

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Game name is required';
    }

    // Minimum players validation
    if (!playerMin || isNaN(playerMin) || parseInt(playerMin) < 1) {
      newErrors.playerMin = 'Minimum players must be a number of at least 1';
    }

    // Maximum players validation (optional but must be valid if provided)
    if (playerMax && (isNaN(playerMax) || parseInt(playerMax) < 1)) {
      newErrors.playerMax = 'Maximum players must be a valid number greater than 0';
    }

    // Check if max players is less than min players
    if (playerMin && playerMax && parseInt(playerMax) < parseInt(playerMin)) {
      newErrors.playerMax = 'Maximum players cannot be less than minimum players';
    }

    // Minimum age validation (optional but must be valid if provided)
    if (minAge && (isNaN(minAge) || parseInt(minAge) < 0)) {
      newErrors.minAge = 'Minimum age must be a valid number of 0 or greater';
    }

    // Estimated time validation (optional but must be valid if provided)
    if (estimatedTime && (isNaN(estimatedTime) || parseInt(estimatedTime) < 1)) {
      newErrors.estimatedTime = 'Estimated time must be a valid number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      player_min: playerMin ? parseInt(playerMin) : null,
      player_max: playerMax ? parseInt(playerMax) : null,
      estimated_time: estimatedTime ? parseInt(estimatedTime) : null,
      min_age: minAge ? parseInt(minAge) : null,
      tags,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-200">

        {/* Game Name */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Game Name <span className="text-red-500">*</span>
            </Label>
          </div>
          <TextInput
            id="name"
            type="text"
            placeholder="Enter the game name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            color={errors.name ? 'failure' : 'gray'}
            helperText={errors.name}
            required
          />
        </div>

        {/* Description */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Description
            </Label>
          </div>
          <Textarea
            id="description"
            placeholder="Describe the game..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Player Count Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="playerMin" className="text-sm font-semibold text-gray-700">
                Minimum Players <span className="text-red-500">*</span>
              </Label>
            </div>
            <TextInput
              id="playerMin"
              type="number"
              min="1"
              placeholder="e.g. 2"
              value={playerMin}
              onChange={(e) => setPlayerMin(e.target.value)}
              color={errors.playerMin ? 'failure' : 'gray'}
              helperText={errors.playerMin}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="playerMax" className="text-sm font-semibold text-gray-700">
                Maximum Players
              </Label>
            </div>
            <TextInput
              id="playerMax"
              type="number"
              min="1"
              placeholder="e.g. 4 (optional)"
              value={playerMax}
              onChange={(e) => setPlayerMax(e.target.value)}
              color={errors.playerMax ? 'failure' : 'gray'}
              helperText={errors.playerMax}
            />
          </div>
        </div>

        {/* Time and Age Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="estimatedTime" className="text-sm font-semibold text-gray-700">
                Estimated Time (minutes)
              </Label>
            </div>
            <TextInput
              id="estimatedTime"
              type="number"
              min="1"
              placeholder="e.g. 60"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              color={errors.estimatedTime ? 'failure' : 'gray'}
              helperText={errors.estimatedTime}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="minAge" className="text-sm font-semibold text-gray-700">
                Minimum Age
              </Label>
            </div>
            <TextInput
              id="minAge"
              type="number"
              min="0"
              placeholder="e.g. 8"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              color={errors.minAge ? 'failure' : 'gray'}
              helperText={errors.minAge}
            />
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">
              Tags
            </Label>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <Badge key={tag.id} color="purple" className="flex items-center">
                  <span className="mr-1">{tag.name}</span>
                  <button 
                    type="button" 
                    className="text-purple-300 hover:text-purple-100 ml-1" 
                    onClick={() => handleRemoveTag(tag.id)}
                    aria-label={`Remove ${tag.name} tag`}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <TextInput
            id="tags"
            type="text"
            placeholder="Search and select tags..."
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
          />
          {tagSearchLoading && (
            <div className="text-sm text-gray-500 mt-1">Searching for tags...</div>
          )}
          {tagOptions.length > 0 && (
            <div className="border border-gray-200 rounded-lg bg-white mt-2 max-h-40 overflow-y-auto shadow-sm">
              {tagOptions.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button color="light" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-300">
            Save Game
          </Button>
        </div>
      </form>
    </div>
  );
}
