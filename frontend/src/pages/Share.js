import React, { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { HiShare, HiGlobeAlt, HiDesktopComputer } from 'react-icons/hi';
import QRCode from 'react-qr-code';

function Share() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const generateShareUrl = () => {
      try {
        setLoading(true);
        
        let baseUrl;
        
        if (process.env.NODE_ENV === 'production') {
          // In production, use the current origin
          baseUrl = window.location.origin;
        } else {
          // In development, extract the base URL from the API URL
          const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
          // Remove '/api' from the end to get the base URL
          baseUrl = apiBaseUrl.replace(/\/api$/, '');
          
          // Replace the backend port (8000) with frontend port (3000)
          baseUrl = baseUrl.replace(':8000', ':3000');
        }
        
        setShareUrl(baseUrl);
      } catch (err) {
        setError('Failed to generate share URL');
        console.error('Error generating share URL:', err);
        // Fallback to current URL
        setShareUrl(window.location.origin);
      } finally {
        setLoading(false);
      }
    };

    generateShareUrl();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <HiShare className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Share Site</h1>
        </div>
        <Card>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HiShare className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Share Site</h1>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Scan QR Code to Access
            </h2>
            <p className="text-gray-600">
              Others can scan this QR code with their phone to access the board games library
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <HiGlobeAlt className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCode
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={shareUrl}
                viewBox="0 0 256 256"
              />
            </div>

            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share URL
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Share;
