import React from 'react';
import { Button } from 'flowbite-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-purple-700 mb-6 md:mb-8 drop-shadow-2xl">Welcome to Family Board Games</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 md:mb-10 max-w-7xl font-medium">Discover, organize, and enjoy your favorite board games with your family. Browse our library or explore by tags to find the perfect game for your next game night!</p>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full justify-center">
          <Button
            gradientDuoTone={undefined}
            size="lg"
            className="px-8 py-3 text-base sm:text-lg shadow-lg w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white border-2 border-purple-900 transition-colors duration-200 hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-purple-300"
            href="#library"
          >
            Explore Library
          </Button>
          <Button
            outline
            gradientDuoTone={undefined}
            size="lg"
            className="px-8 py-3 text-base sm:text-lg shadow-lg w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white border-2 border-purple-900 transition-colors duration-200 hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-purple-300"
            href="#tags"
          >
            Browse Tags
          </Button>
        </div>
      </main>
      <footer className="w-full max-w-7xl mx-auto text-center py-6 text-gray-500 text-base bg-white mt-auto shadow-inner rounded-t-2xl border-t-2 border-purple-100">
        <span className="font-semibold">© {new Date().getFullYear()} Family Board Games.</span> <span className="italic">All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
