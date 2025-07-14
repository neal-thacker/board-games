import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from './GameCard';

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/games')
      .then((res) => {
        console.log(res);
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    fetch(`http://localhost:8000/api/games/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete game');
        setGames((games) => games.filter((g) => g.id !== id));
      })
      .catch((err) => setError(err.message));
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
              <GameCard
                key={game.id || idx}
                game={{ ...game, onDelete: handleDelete }}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}

export default Library;
