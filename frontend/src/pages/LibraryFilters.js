import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, TextInput, Badge } from 'flowbite-react';
import { apiFetch } from '../api';

function LibraryFilters({
  searchTerm,
  onSearchChange,
  selectedTagIds,
  playerCount,
  onFiltersChange,
  onClearFilters
}) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempSelectedTagIds, setTempSelectedTagIds] = useState([]);
  const [tempPlayerCount, setTempPlayerCount] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [playerStats, setPlayerStats] = useState({ min_players: 1, max_players: 10, suggested_default: 4 });
  const [loadingPlayerStats, setLoadingPlayerStats] = useState(true);

  // Load available tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoadingTags(true);
        const res = await apiFetch('/tags');
        if (!res.ok) throw new Error('Failed to load tags');
        const tags = await res.json();
        setAvailableTags(Array.isArray(tags) ? tags : []);
      } catch (err) {
        console.error('Error loading tags:', err);
        setAvailableTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    
    loadTags();
  }, []);

  // Load player count statistics
  useEffect(() => {
    const loadPlayerStats = async () => {
      try {
        setLoadingPlayerStats(true);
        const res = await apiFetch('/games-player-stats');
        if (!res.ok) throw new Error('Failed to load player stats');
        const stats = await res.json();
        setPlayerStats(stats);
      } catch (err) {
        console.error('Error loading player stats:', err);
      } finally {
        setLoadingPlayerStats(false);
      }
    };
    
    loadPlayerStats();
  }, []);

  // Handle tag selection in modal (temporary state)
  const handleTempTagToggle = (tagId) => {
    setTempSelectedTagIds(prev => {
      const currentIds = Array.isArray(prev) ? prev : [];
      if (currentIds.includes(tagId)) {
        return currentIds.filter(id => id !== tagId);
      } else {
        return [...currentIds, tagId];
      }
    });
  };

  // Apply filters from modal
  const applyFilters = () => {
    onFiltersChange({
      selectedTagIds: tempSelectedTagIds,
      playerCount: tempPlayerCount
    });
    setShowFilterModal(false);
  };

  // Cancel modal and reset temporary state
  const cancelFilters = () => {
    setTempSelectedTagIds(selectedTagIds);
    setTempPlayerCount(playerCount);
    setShowFilterModal(false);
  };

  // Open modal and initialize temporary state
  const openFilterModal = () => {
    setTempSelectedTagIds(selectedTagIds);
    setTempPlayerCount(playerCount);
    setShowFilterModal(true);
  };

  // Remove individual tag filter
  const removeTagFilter = (tagId) => {
    const newTagIds = Array.isArray(selectedTagIds) ? selectedTagIds.filter(id => id !== tagId) : [];
    onFiltersChange({
      selectedTagIds: newTagIds,
      playerCount
    });
  };

  // Remove player count filter
  const removePlayerCountFilter = () => {
    onFiltersChange({
      selectedTagIds,
      playerCount: null
    });
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() || (Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null;

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Search Bar and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <TextInput
            type="text"
            placeholder="Search games by name, description, or tags..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full"
            sizing="lg"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange({ target: { value: '' } })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-end">
          {/* Filter Button */}
          <Button
            onClick={openFilterModal}
            color={(Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null ? 'purple' : 'light'}
            className="flex items-center gap-2"
          >
            <span>🔍</span>
            Filters
            {((Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null) && (
              <Badge color="purple" size="sm">
                {(Array.isArray(selectedTagIds) ? selectedTagIds.length : 0) + (playerCount !== null ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              color="light"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {((Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Tag filters */}
          {Array.isArray(selectedTagIds) && selectedTagIds.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            return tag ? (
              <Badge
                key={tagId}
                color="purple"
                className="flex items-center gap-1"
              >
                {tag.name}
                <button
                  onClick={() => removeTagFilter(tagId)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ✕
                </button>
              </Badge>
            ) : null;
          })}
          
          {/* Player count filter */}
          {playerCount !== null && (
            <Badge
              color="info"
              className="flex items-center gap-1"
            >
              {playerCount} {playerCount === 1 ? 'player' : 'players'}
              <button
                onClick={removePlayerCountFilter}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Filter Modal */}
      <Modal show={showFilterModal} onClose={cancelFilters} size="lg">
        <ModalHeader>
          Filter Games
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Player Count Section */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Number of Players:</h4>
              {loadingPlayerStats ? (
                <p className="text-gray-500">Loading player count range...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Any number of players</span>
                    <span>{tempPlayerCount !== null ? `${tempPlayerCount} players` : 'No filter'}</span>
                  </div>
                  
                  {/* Single Player Count Slider */}
                  <div className="relative">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="enable-player-filter"
                          checked={tempPlayerCount !== null}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTempPlayerCount(playerStats.suggested_default || Math.ceil((playerStats.min_players + playerStats.max_players) / 2));
                            } else {
                              setTempPlayerCount(null);
                            }
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="enable-player-filter" className="text-sm text-gray-700">
                          Filter by specific player count
                        </label>
                      </div>
                      
                      {tempPlayerCount !== null && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-2">
                            Show games that support {tempPlayerCount} {tempPlayerCount === 1 ? 'player' : 'players'}
                          </label>
                          <input
                            type="range"
                            min={playerStats.min_players}
                            max={playerStats.max_players}
                            value={tempPlayerCount}
                            onChange={(e) => setTempPlayerCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 
                                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                                     [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                                     [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                                     [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 
                                     [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md 
                                     [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{playerStats.min_players}</span>
                            <span>{playerStats.max_players}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Filter by Tags:</h4>
              {loadingTags ? (
                <p className="text-gray-500">Loading tags...</p>
              ) : Array.isArray(availableTags) && availableTags.length === 0 ? (
                <p className="text-gray-500">No tags available</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {Array.isArray(availableTags) && availableTags.map(tag => (
                    <label
                      key={tag.id}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={tempSelectedTagIds.includes(tag.id)}
                        onChange={() => handleTempTagToggle(tag.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={() => {
                setTempSelectedTagIds([]);
                setTempPlayerCount(null);
              }}
              color="light"
            >
              Clear All
            </Button>
            <div className="flex space-x-3">
              <Button
                onClick={cancelFilters}
                color="light"
              >
                Cancel
              </Button>
              <Button
                onClick={applyFilters}
                color="purple"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default LibraryFilters;
