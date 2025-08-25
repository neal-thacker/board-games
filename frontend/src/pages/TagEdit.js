import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { HiArrowLeft, HiPencil, HiTag, HiInformationCircle, HiCheckCircle } from 'react-icons/hi';

function TagEdit() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/tags/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setOriginalName(data.name);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tag data');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const res = await apiFetch(`/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update tag');
        setIsSubmitting(false);
        return;
      }
      navigate('/tags');
    } catch (err) {
      setError('Network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tag details...</p>
        </div>
      </div>
    );
  }

  const hasChanges = name !== originalName;

  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/tags">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back to Tags
            </button>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <HiPencil className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Tag</h1>
            <p className="text-gray-600">Update the tag information</p>
          </div>
        </div>
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

          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HiCheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Changes detected!</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    Don't forget to save your changes.
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiTag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="tagName"
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter tag name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Original name: <span className="font-medium text-gray-800">{originalName}</span>
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                color="blue" 
                size="lg"
                disabled={isSubmitting || !name.trim() || !hasChanges}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-4 h-4 mr-2" />
                    Update Tag
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

export default TagEdit;
