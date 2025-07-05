import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/games')
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
    fetch(`http://localhost:8000/games/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete game');
        setGames((games) => games.filter((g) => g.id !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4 w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
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
        <ul className="space-y-2 w-full max-w-2xl mx-auto">
          {games.length === 0 ? (
            <li>No games found.</li>
          ) : (
            games.map((game, idx) => (
              <li key={game.id || idx} className="bg-gray-100 rounded p-2 flex justify-between items-center">
                <span>{game.name || JSON.stringify(game)}</span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => navigate(`/games/${game.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDelete(game.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}

export default Library;
