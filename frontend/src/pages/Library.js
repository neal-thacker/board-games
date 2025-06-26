import React, { useEffect, useState } from 'react';

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4 w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">Library</h2>
      <p className="text-lg text-gray-700">Browse all available board games here.</p>
      {loading && <p>Loading games...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <ul className="space-y-2">
          {games.length === 0 ? (
            <li>No games found.</li>
          ) : (
            games.map((game, idx) => (
              <li key={game.id || idx} className="bg-gray-100 rounded p-2">
                {game.name || JSON.stringify(game)}
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}

export default Library;
