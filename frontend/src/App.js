import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HiMenu, HiHome, HiCollection, HiTag, HiShare, HiX, HiLogout, HiShieldCheck, HiUserGroup } from "react-icons/hi";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Library from './pages/Library';
import TagsList from './pages/TagsList';
import Share from './pages/Share';
import GameCreate from './pages/GameCreate';
import GameView from './pages/GameView';
import GameEdit from './pages/GameEdit';
import TagCreate from './pages/TagCreate';
import TagEdit from './pages/TagEdit';
import TagDelete from './pages/TagDelete';
import TagView from './pages/TagView';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Library from './pages/Library';
import TagsList from './pages/TagsList';
import Share from './pages/Share';
import GameCreate from './pages/GameCreate';
import GameView from './pages/GameView';
import GameEdit from './pages/GameEdit';
import TagCreate from './pages/TagCreate';
import TagEdit from './pages/TagEdit';
import TagDelete from './pages/TagDelete';
import TagView from './pages/TagView';

function AppContent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      {/* Main content centered and max width, responsive */}
      <main className="flex-1 w-full flex flex-col items-center max-w-7xl mx-auto bg-gray-50 px-2 sm:px-6">
        <div className="w-full max-w-4xl flex flex-col py-4 sm:py-6">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/tags" element={
              <ProtectedRoute>
                <TagsList />
              </ProtectedRoute>
            } />
            <Route path="/tags/:id" element={
              <ProtectedRoute>
                <TagView />
              </ProtectedRoute>
            } />
            <Route path="/share" element={
              <ProtectedRoute>
                <Share />
              </ProtectedRoute>
            } />
            <Route path="/tags/create" element={
              <ProtectedRoute adminOnly={true}>
                <TagCreate />
              </ProtectedRoute>
            } />
            <Route path="/tags/:id/edit" element={
              <ProtectedRoute adminOnly={true}>
                <TagEdit />
              </ProtectedRoute>
            } />
            <Route path="/tags/:id/delete" element={
              <ProtectedRoute adminOnly={true}>
                <TagDelete />
              </ProtectedRoute>
            } />
            <Route path="/games/new" element={
              <ProtectedRoute adminOnly={true}>
                <GameCreate />
              </ProtectedRoute>
            } />
            <Route path="/games/:id" element={
              <ProtectedRoute>
                <GameView />
              </ProtectedRoute>
            } />
            <Route path="/games/:id/edit" element={
              <ProtectedRoute adminOnly={true}>
                <GameEdit />
              </ProtectedRoute>
            } />
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
