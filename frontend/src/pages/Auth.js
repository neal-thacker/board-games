import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiEye, HiEyeOff, HiUserGroup, HiShieldCheck } from 'react-icons/hi';

const Auth = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, guest } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await guest();
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Failed to continue as guest');
      }
    } catch (err) {
      setError('Failed to continue as guest. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-purple-700">
            Family Board Games
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="space-y-6">
          {/* Admin Login Card */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HiShieldCheck className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Admin Access</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Enter the admin password to manage games and tags
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                disabled={!password || loading}
                className="w-full"
                color="purple"
              >
                {loading ? 'Signing in...' : 'Sign in as Admin'}
              </Button>
            </form>
          </div>

          {/* Guest Access Card */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HiUserGroup className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Guest Access</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Browse games and tags in read-only mode
            </p>

            <Button
              onClick={handleGuestAccess}
              disabled={loading}
              className="w-full"
              color="blue"
              outline
            >
              {loading ? 'Loading...' : 'Continue as Guest'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Admin access allows full management of games and tags.<br />
              Guest access provides read-only browsing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
