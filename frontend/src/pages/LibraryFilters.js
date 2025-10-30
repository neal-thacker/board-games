import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, TextInput, Badge } from 'flowbite-react';
import { apiFetch } from '../api';
import { HiXMark } from 'react-icons/hi2';

function LibraryFilters({
  searchTerm,
  onSearchChange,
  selectedTagIds,
  playerCount,
  minAge,
  maxTime,
  onFiltersChange,
  onClearFilters
}) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempSelectedTagIds, setTempSelectedTagIds] = useState([]);
  const [tempPlayerCount, setTempPlayerCount] = useState(null);
  const [tempMinAge, setTempMinAge] = useState(null);
  const [tempMaxTime, setTempMaxTime] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [playerStats, setPlayerStats] = useState({ min_players: 1, max_players: 10, suggested_default: 4 });
  const [loadingPlayerStats, setLoadingPlayerStats] = useState(true);
  const [ageStats, setAgeStats] = useState({ min_age: 1, max_age: 18, suggested_default: 8 });
  const [loadingAgeStats, setLoadingAgeStats] = useState(true);

  // Load available tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoadingTags(true);
        const res = await apiFetch('/tags?all=true');
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

  // Load age statistics
  useEffect(() => {
    const loadAgeStats = async () => {
      try {
        setLoadingAgeStats(true);
        const res = await apiFetch('/games-age-stats');
        if (!res.ok) throw new Error('Failed to load age stats');
        const stats = await res.json();
        setAgeStats(stats);
      } catch (err) {
        console.error('Error loading age stats:', err);
      } finally {
        setLoadingAgeStats(false);
      }
    };
    
    loadAgeStats();
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
      playerCount: tempPlayerCount,
      minAge: tempMinAge,
      maxTime: tempMaxTime
    });
    setShowFilterModal(false);
  };

  // Cancel modal and reset temporary state
  const cancelFilters = () => {
    setTempSelectedTagIds(selectedTagIds);
    setTempPlayerCount(playerCount);
    setTempMinAge(minAge);
    setTempMaxTime(maxTime);
    setShowFilterModal(false);
  };

  // Open modal and initialize temporary state
  const openFilterModal = () => {
    setTempSelectedTagIds(selectedTagIds);
    setTempPlayerCount(playerCount);
    setTempMinAge(minAge);
    setTempMaxTime(maxTime);
    setShowFilterModal(true);
  };

  // Remove individual tag filter
  const removeTagFilter = (tagId) => {
    const newTagIds = Array.isArray(selectedTagIds) ? selectedTagIds.filter(id => id !== tagId) : [];
    onFiltersChange({
      selectedTagIds: newTagIds,
      playerCount,
      minAge
    });
  };

  // Remove player count filter
  const removePlayerCountFilter = () => {
    onFiltersChange({
      selectedTagIds,
      playerCount: null,
      minAge
    });
  };

  // Remove minimum age filter
  const removeMinAgeFilter = () => {
    onFiltersChange({
      selectedTagIds,
      playerCount,
      minAge: null
    });
  };

  // Remove maximum time filter
  const removeMaxTimeFilter = () => {
    onFiltersChange({
      selectedTagIds,
      playerCount,
      minAge,
      maxTime: null
    });
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() || (Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null || minAge !== null;

  return (
    <div className="w-full max-w-4xl">
      {/* Search Bar and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <TextInput
            type="text"
            placeholder="Search games by name or description..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full"
            sizing="md"
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
            color={(Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null || minAge !== null ? 'purple' : 'light'}
            className="flex items-center gap-2"
          >
            Filters
            {((Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null || minAge !== null) && (
              <Badge color="purple" size="sm">
                {(Array.isArray(selectedTagIds) ? selectedTagIds.length : 0) + (playerCount !== null ? 1 : 0) + (minAge !== null ? 1 : 0)}
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
      {((Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null || minAge !== null || maxTime !== null) && (
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {/* Tag filters */}
          {Array.isArray(selectedTagIds) && selectedTagIds.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            return tag ? (
              <div
                key={tagId}
                onClick={() => removeTagFilter(tagId)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 whitespace-nowrap"
              >
                <span>{tag.name}</span>
                <HiXMark className="text-purple-600 hover:text-purple-800 w-3 h-3 flex-shrink-0" />
              </div>
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

          {/* Minimum age filter */}
          {minAge !== null && (
            <Badge
              color="yellow"
              className="flex items-center gap-1"
            >
              Age {minAge}+
              <button
                onClick={removeMinAgeFilter}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </Badge>
          )}

          {/* Maximum time filter */}
          {maxTime !== null && (
            <Badge
              color="green"
              className="flex items-center gap-1"
            >
              Up to {maxTime} mins
              <button
                onClick={removeMaxTimeFilter}
                className="ml-1 text-green-600 hover:text-green-800"
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

            {/* Minimum Age Section */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Minimum Age:</h4>
              {loadingAgeStats ? (
                <p className="text-gray-500">Loading age range...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Any age</span>
                    <span>{tempMinAge !== null ? `Age ${tempMinAge}+` : 'No filter'}</span>
                  </div>
                  
                  {/* Minimum Age Slider */}
                  <div className="relative">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="enable-age-filter"
                          checked={tempMinAge !== null}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTempMinAge(ageStats.suggested_default || Math.ceil((ageStats.min_age + ageStats.max_age) / 2));
                            } else {
                              setTempMinAge(null);
                            }
                          }}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <label htmlFor="enable-age-filter" className="text-sm text-gray-700">
                          Filter by minimum age
                        </label>
                      </div>
                      
                      {tempMinAge !== null && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-2">
                            Show games suitable for ages {tempMinAge} and up
                          </label>
                          <input
                            type="range"
                            min={ageStats.min_age}
                            max={ageStats.max_age}
                            value={tempMinAge}
                            onChange={(e) => setTempMinAge(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                     focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-600 
                                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                                     [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                                     [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                                     [&::-moz-range-thumb]:bg-yellow-600 [&::-moz-range-thumb]:border-2 
                                     [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md 
                                     [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{ageStats.min_age}</span>
                            <span>{ageStats.max_age}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Maximum Time Section */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Maximum Play Time (minutes):</h4>
              {loadingAgeStats ? (
                <p className="text-gray-500">Loading time range...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>No maximum time</span>
                    <span>{tempMaxTime !== null ? `Up to ${tempMaxTime} mins` : 'No filter'}</span>
                  </div>
                  
                  {/* Maximum Time Slider */}
                  <div className="relative">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="enable-time-filter"
                          checked={tempMaxTime !== null}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTempMaxTime(60); // Default to 60 mins
                            } else {
                              setTempMaxTime(null);
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="enable-time-filter" className="text-sm text-gray-700">
                          Filter by maximum play time
                        </label>
                      </div>
                      
                      {tempMaxTime !== null && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-2">
                            Show games that can be played in up to {tempMaxTime} minutes
                          </label>
                          <input
                            type="range"
                            min={15}
                            max={240}
                            step={15}
                            value={tempMaxTime}
                            onChange={(e) => setTempMaxTime(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
                                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 
                                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                                     [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                                     [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full 
                                     [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:border-2 
                                     [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md 
                                     [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>15 mins</span>
                            <span>240 mins</span>
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
                setTempMinAge(null);
              }}
              color="light"
            >
              Clear
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
