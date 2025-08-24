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
  const navigate = useNavigate();
  const observerRef = useRef();

  const loadGames = useCallback(async (page = 1, reset = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const res = await apiFetch(`/games?page=${page}&per_page=12`);
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
  }, []);

  useEffect(() => {
    loadGames(1, true);
  }, [loadGames]);

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
      <p className="text-lg text-gray-700">Browse all available board games here.</p>
      {loading && <p>Loading games...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="flex flex-wrap gap-6 w-full max-w-5xl mx-auto justify-center">
          {games.length === 0 ? (
            <div className="text-gray-500">No games found.</div>
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
