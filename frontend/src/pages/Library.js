import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Pagination } from 'flowbite-react';
import GameCard from './GameCard';
import LibraryFilters from './LibraryFilters';

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [playerCount, setPlayerCount] = useState(null);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef();

  const loadGames = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: itemsPerPage.toString()
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
      
      // Ensure data.data is an array, fallback to empty array if not
      const gamesData = data && data.data ? data.data : [];
      setGames(Array.isArray(gamesData) ? gamesData : []);
      setCurrentPage(data && data.current_page ? data.current_page : 1);
      setTotalPages(data && data.last_page ? data.last_page : 1);
      setTotalItems(data && data.total ? data.total : 0);
      setItemsPerPage(data && data.per_page ? data.per_page : 12);
      setError(null);
    } catch (err) {
      console.error('Error loading games:', err);
      setError(`Failed to load games: ${err.message}`);
      setGames([]); // Ensure games is always an array
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedTagIds, playerCount, itemsPerPage]);

  useEffect(() => {
    loadGames(1);
  }, [loadGames]);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadGames(1);
    }
  }, [searchTerm, selectedTagIds, playerCount]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadGames(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Handle filter changes from LibraryFilters component
  const handleFiltersChange = ({ selectedTagIds: newTagIds, playerCount: newPlayerCount }) => {
    setSelectedTagIds(newTagIds);
    setPlayerCount(newPlayerCount);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTagIds([]);
    setPlayerCount(null);
    setCurrentPage(1);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center w-full max-w-7xl mx-auto space-y-8 md:space-y-12 p-4">
      {/* Header */}
      <div className="flex w-full justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-purple-700">Library</h2>
        <Button
          color="purple"
          onClick={() => navigate('/games/new')}
        >
          + Add Game
        </Button>
      </div>
      
      {/* Search and Filter Section */}
      <LibraryFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedTagIds={selectedTagIds}
        playerCount={playerCount}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <p className="text-lg text-gray-700">Browse all available board games here.</p>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-600">Loading games...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4">
          Error: {error}
        </div>
      )}
      
      {/* Games Grid */}
      {!loading && !error && (
        <div className="w-full max-w-7xl mx-auto">
          {!Array.isArray(games) || games.length === 0 ? (
            <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
              {searchTerm.trim() || (Array.isArray(selectedTagIds) && selectedTagIds.length > 0) || playerCount !== null ? 'No games match your search criteria.' : 'No games found.'}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="flex justify-center mb-6">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} games
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {Array.isArray(games) && games.map((game, idx) => (
                  <GameCard
                    key={game.id || idx}
                    game={game}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    layout="table"
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    showIcons
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default Library;
