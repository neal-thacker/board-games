import React from 'react';

function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4 w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-purple-700 mb-6 md:mb-8 drop-shadow-2xl">Welcome to Family Board Games</h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 md:mb-10 max-w-7xl font-medium">Discover, organize, and enjoy your favorite board games with your family. Browse our library or explore by tags to find the perfect game for your next game night!</p>
    </main>
  );
}

export default Home;
