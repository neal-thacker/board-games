import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer bg-white hover:shadow-2xl rounded-lg p-6 flex flex-col items-start transition-transform duration-200 border hover:border-2 border-purple-700 w-full max-w-xs h-48 justify-center"
      onClick={() => navigate(`/games/${game.id}`)}
      title={game.name}
    >
      <h3 className="text-xl font-semibold text-purple-700 mb-2 w-full text-center">{game.name}</h3>
      {game.description && (
        <p className="text-gray-600 mb-4 line-clamp-2 w-full text-center">{game.description}</p>
      )}
    </div>
  );
}

export default GameCard;
