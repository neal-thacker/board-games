import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';
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
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [showTagFilter, setShowTagFilter] = useState(false);
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
  }, [searchTerm, selectedTagIds]);

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

  // Handle tag selection
  const handleTagToggle = (tagId) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTagIds([]);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() || selectedTagIds.length > 0;

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
          {/* Tag Filter Toggle */}
          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showTagFilter || selectedTagIds.length > 0
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏷️ Tags ({selectedTagIds.length})
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
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTagIds.map(tagId => {
                const tag = availableTags.find(t => t.id === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {tag.name}
                    <button
                      onClick={() => handleTagToggle(tagId)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ✕
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Tag Filter Dropdown */}
        {showTagFilter && (
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Filter by Tags:</h4>
            {loadingTags ? (
              <p className="text-gray-500">Loading tags...</p>
            ) : availableTags.length === 0 ? (
              <p className="text-gray-500">No tags available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {availableTags.map(tag => (
                  <label
                    key={tag.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
