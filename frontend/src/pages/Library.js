import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'flowbite-react';
import GameCard from './GameCard';

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tempSelectedTagIds, setTempSelectedTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [playerCount, setPlayerCount] = useState(null);
  const [tempPlayerCount, setTempPlayerCount] = useState(null);
  const [playerStats, setPlayerStats] = useState({ min_players: 1, max_players: 10, suggested_default: 4 });
  const [loadingPlayerStats, setLoadingPlayerStats] = useState(true);
  const navigate = useNavigate();
  const observerRef = useRef();
  const searchTimeoutRef = useRef();

  const loadGames = useCallback(async (page = 1, reset = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '12'
      });
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      if (selectedTagIds.length > 0) {
        selectedTagIds.forEach(tagId => {
          params.append('tag_ids[]', tagId.toString());
        });
      }
      
      // Add player count filter if specified
      if (playerCount !== null) {
        params.append('player_count', playerCount.toString());
      }
      
      const res = await apiFetch(`/games?${params.toString()}`);
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      
      if (reset || page === 1) {
        setGames(data.data);
      } else {
        setGames(prev => [...prev, ...data.data]);
      }
      
      setHasMore(data.has_more);
      setCurrentPage(data.current_page);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, selectedTagIds, playerCount]);

  useEffect(() => {
    loadGames(1, true);
  }, [loadGames]);

  // Load available tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoadingTags(true);
        const res = await apiFetch('/tags');
        if (!res.ok) throw new Error('Failed to load tags');
        const tags = await res.json();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Error loading tags:', err);
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
        setPlayerCount(null); // Start with no filter
        setTempPlayerCount(null);
      } catch (err) {
        console.error('Error loading player stats:', err);
      } finally {
        setLoadingPlayerStats(false);
      }
    };
    
    loadPlayerStats();
  }, []);

  // Handle search with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      // This will trigger loadGames through the useEffect dependency
    }, 300);
  };

  // Handle tag selection in modal (temporary state)
  const handleTempTagToggle = (tagId) => {
    setTempSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Apply filters from modal
  const applyFilters = () => {
    setSelectedTagIds(tempSelectedTagIds);
    setPlayerCount(tempPlayerCount);
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTagIds([]);
    setTempSelectedTagIds([]);
    setPlayerCount(null);
    setTempPlayerCount(null);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() || selectedTagIds.length > 0 || playerCount !== null;

  // Intersection Observer for infinite scrolling
  const lastGameElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadGames(currentPage + 1, false);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore, currentPage, loadGames]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    
    try {
      const res = await apiFetch(`/games/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete game');
      
      setGames((games) => games.filter((g) => g.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
      <div className="flex w-full justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-purple-700">Library</h2>
        <button
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => navigate('/games/new')}
        >
          + Add Game
        </button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="w-full max-w-4xl space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search games by name, description, or tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-center">
          {/* Filter Button */}
          <button
            onClick={openFilterModal}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              selectedTagIds.length > 0 || playerCount !== null
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🔍</span>
            Filters
            {(selectedTagIds.length > 0 || playerCount !== null) && (
              <span className="bg-purple-200 text-purple-800 rounded-full px-2 py-1 text-xs">
                {selectedTagIds.length + (playerCount !== null ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          )}

          {/* Active Filters Display */}
          {(selectedTagIds.length > 0 || playerCount !== null) && (
            <div className="flex flex-wrap gap-2">
              {/* Tag filters */}
              {selectedTagIds.map(tagId => {
                const tag = availableTags.find(t => t.id === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {tag.name}
                    <button
                      onClick={() => setSelectedTagIds(prev => prev.filter(id => id !== tagId))}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ✕
                    </button>
                  </span>
                ) : null;
              })}
              
              {/* Player count filter */}
              {playerCount !== null && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {playerCount} {playerCount === 1 ? 'player' : 'players'}
                  <button
                    onClick={() => {
                      setPlayerCount(null);
                      setTempPlayerCount(null);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

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
              ) : availableTags.length === 0 ? (
                <p className="text-gray-500">No tags available</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {availableTags.map(tag => (
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
            <button
              onClick={() => {
                setTempSelectedTagIds([]);
                setTempPlayerCount(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <div className="flex space-x-6">
              <button
                onClick={cancelFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      <p className="text-lg text-gray-700">Browse all available board games here.</p>
      {loading && <p>Loading games...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="flex flex-wrap gap-6 w-full max-w-5xl mx-auto justify-center">
          {games.length === 0 ? (
            <div className="text-gray-500">
              {hasActiveFilters ? 'No games match your search criteria.' : 'No games found.'}
            </div>
          ) : (
            games.map((game, idx) => (
              <div
                key={game.id || idx}
                ref={idx === games.length - 1 ? lastGameElementRef : null}
              >
                <GameCard
                  game={{ ...game, onDelete: handleDelete }}
                />
              </div>
            ))
          )}
        </div>
      )}
      
      {loadingMore && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading more games...</span>
        </div>
      )}
      
      {!hasMore && games.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          You've reached the end of the library!
        </div>
      )}
    </main>
  );
}

export default Library;
