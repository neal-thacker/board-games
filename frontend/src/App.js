import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Tags from './pages/Tags';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="w-full max-w-7xl mx-auto flex justify-center gap-12 py-4 bg-white shadow-md rounded-b-2xl border-b-2 border-purple-100 mb-4">
          <Link to="/" className="font-semibold text-purple-700 hover:underline">Home</Link>
          <Link to="/library" className="font-semibold text-purple-700 hover:underline">Library</Link>
          <Link to="/tags" className="font-semibold text-purple-700 hover:underline">Tags</Link>
        </nav>
        <div className="flex-1 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/tags" element={<Tags />} />
          </Routes>
        </div>
        <footer className="w-full max-w-7xl mx-auto text-center py-6 text-gray-500 text-base bg-white mt-auto shadow-inner rounded-t-2xl border-t-2 border-purple-100">
          <span className="font-semibold">© {new Date().getFullYear()} Family Board Games.</span> <span className="italic">All rights reserved.</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
