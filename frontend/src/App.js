import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HiMenu, HiHome, HiCollection, HiTag, HiX } from "react-icons/hi";
import Home from './pages/Home';
import Library from './pages/Library';
import TagsList from './pages/TagsList';
import GameCreate from './pages/GameCreate';
import GameView from './pages/GameView';
import GameEdit from './pages/GameEdit';
import TagCreate from './pages/TagCreate';
import TagEdit from './pages/TagEdit';
import TagDelete from './pages/TagDelete';

function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <nav className="w-full flex justify-between items-center py-4 bg-white shadow-md border-b-2 border-purple-600 px-2 sm:px-4 relative z-20">
          <div className="font-bold text-lg text-purple-700 flex items-center gap-2">
            <span className="hidden sm:inline">Family Board Games</span>
          </div>
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Open navigation menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <HiX className="w-7 h-7 text-purple-700" /> : <HiMenu className="w-7 h-7 text-purple-700" />}
          </button>
          {navOpen && (
            <div className="absolute top-full left-0 w-full flex flex-col items-center bg-white shadow-lg border-b-2 border-purple-600 animate-fade-in z-30 md:hidden">
              <Link to="/" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3 border-b border-purple-100">
                <HiHome className="w-5 h-5 mr-2" /> Home
              </Link>
              <Link to="/library" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3 border-b border-purple-100">
                <HiCollection className="w-5 h-5 mr-2" /> Library
              </Link>
              <Link to="/tags" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3">
                <HiTag className="w-5 h-5 mr-2" /> Tags
              </Link>
            </div>
          )}
        </nav>
        {/* Main content centered and max width, responsive */}
        <main className="flex-1 w-full flex flex-col items-center max-w-7xl mx-auto bg-gray-50 px-2 sm:px-6">
          <div className="w-full max-w-4xl flex flex-col py-4 sm:py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/tags" element={<TagsList />} />
              <Route path="/tags/create" element={<TagCreate />} />
              <Route path="/tags/:id/edit" element={<TagEdit />} />
              <Route path="/tags/:id/delete" element={<TagDelete />} />
              <Route path="/games/new" element={<GameCreate />} />
              <Route path="/games/:id" element={<GameView />} />
              <Route path="/games/:id/edit" element={<GameEdit />} />
            </Routes>
          </div>
        </main>
        {/* Footer spans full width, responsive */}
        <footer className="w-full flex justify-center bg-white mt-auto shadow-inner border-t-2 border-purple-600 px-2 sm:px-4">
          <div className="w-full max-w-7xl text-center py-4 sm:py-6 text-gray-500 text-sm sm:text-base">
            <span className="font-semibold">© {new Date().getFullYear()} Family Board Games.</span> <span className="italic">All rights reserved.</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
