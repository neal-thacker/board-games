import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiHome, HiCollection, HiTag, HiShare, HiX, HiLogout, HiShieldCheck, HiUserGroup } from "react-icons/hi";
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { user, logout, isAdmin, isGuest, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setNavOpen(false);
  };

  // Don't render navigation if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="w-full bg-white shadow-md border-b-2 border-purple-600 relative z-20">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between py-4 px-2 sm:px-4">
        <div className="font-bold text-xl text-purple-700">
          Family Board Games
        </div>
        
        <div className="flex items-center justify-center gap-8">
          <Link to="/" className="flex items-center font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors duration-200">
            <HiHome className="w-5 h-5 mr-2" /> Home
          </Link>
          <Link to="/library" className="flex items-center font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors duration-200">
            <HiCollection className="w-5 h-5 mr-2" /> Library
          </Link>
          <Link to="/tags" className="flex items-center font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors duration-200">
            <HiTag className="w-5 h-5 mr-2" /> Tags
          </Link>
          <Link to="/share" className="flex items-center font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors duration-200">
            <HiShare className="w-5 h-5 mr-2" /> Share
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* User Role Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isAdmin() ? (
              <div className="flex items-center gap-1 text-purple-600">
                <HiShieldCheck className="w-4 h-4" />
                <span className="font-medium">Admin</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-blue-600">
                <HiUserGroup className="w-4 h-4" />
                <span className="font-medium">Guest</span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <HiLogout className="w-4 h-4 mr-1" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between items-center py-4 px-2 sm:px-4">
        <div className="font-bold text-lg text-purple-700 flex items-center gap-2">
          <span className="inline">Family Board Games</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile User Role Indicator */}
          <div className="flex items-center gap-1 text-sm">
            {isAdmin() ? (
              <div className="flex items-center gap-1 text-purple-600">
                <HiShieldCheck className="w-4 h-4" />
                <span className="font-medium">Admin</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-blue-600">
                <HiUserGroup className="w-4 h-4" />
                <span className="font-medium">Guest</span>
              </div>
            )}
          </div>

          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Open navigation menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <HiX className="w-7 h-7 text-purple-700" /> : <HiMenu className="w-7 h-7 text-purple-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {navOpen && (
        <div className="md:hidden absolute top-full left-0 w-full flex flex-col items-center bg-white shadow-lg border-b-2 border-purple-600 animate-fade-in z-30">
          <Link to="/" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3 border-b border-purple-100">
            <HiHome className="w-5 h-5 mr-2" /> Home
          </Link>
          <Link to="/library" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3 border-b border-purple-100">
            <HiCollection className="w-5 h-5 mr-2" /> Library
          </Link>
          <Link to="/tags" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3 border-b border-purple-100">
            <HiTag className="w-5 h-5 mr-2" /> Tags
          </Link>
          <Link to="/share" onClick={() => setNavOpen(false)} className="flex items-center w-full justify-center font-semibold text-purple-700 hover:bg-purple-50 px-4 py-3 border-b border-purple-100">
            <HiShare className="w-5 h-5 mr-2" /> Share
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full justify-center font-semibold text-gray-600 hover:bg-gray-50 px-4 py-3"
          >
            <HiLogout className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
