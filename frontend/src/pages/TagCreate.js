import React, { useState } from 'react';
import { apiFetch } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiArrowLeft, HiPlus, HiTag, HiInformationCircle } from 'react-icons/hi';

function TagCreate() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const res = await apiFetch('/tags', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to create tag');
        setIsSubmitting(false);
        return;
      }
      navigate('/tags');
    } catch (err) {
      setError('Network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/tags">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back to Tags
            </button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Create New Tag</h1>
        <p className="text-gray-600">Add a new tag to organize your board games</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <HiTag className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Tag Details</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HiInformationCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error!</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-2">
                Tag Name
              </label>
              <input
                id="tagName"
                type="text"
                className="block w-full pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tag name (e.g., Strategy, Family, Card Game)"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <p className="mt-2 text-sm text-gray-600">
                Choose a descriptive name that will help you categorize your games.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                color="blue" 
                size="lg"
                disabled={isSubmitting || !name.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <HiPlus className="w-4 h-4 mr-2" />
                    Create Tag
                  </>
                )}
              </Button>
              <Link to="/tags" className="flex-1">
                <button className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TagCreate;
