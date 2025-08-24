import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { Button } from 'flowbite-react';
import { HiArrowLeft, HiTrash, HiExclamation, HiInformationCircle, HiTag } from 'react-icons/hi';

function TagDelete() {
  const { id } = useParams();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/tags/${id}`)
      .then(res => res.json())
      .then(data => {
        setTag(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tag data');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    
    try {
      const res = await apiFetch(`/tags/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        setError('Failed to delete tag. Please try again.');
        setIsDeleting(false);
        return;
      }
      navigate('/tags');
    } catch (err) {
      setError('Network error occurred. Please try again.');
      setIsDeleting(false);
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

  if (!tag) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="text-center py-8">
              <HiExclamation className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tag Not Found</h2>
              <p className="text-gray-600 mb-6">The tag you're looking for doesn't exist or has been deleted.</p>
              <Link to="/tags">
                <Button color="blue">
                  <HiArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tags
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
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
          <div className="p-3 bg-red-100 rounded-lg">
            <HiTrash className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delete Tag</h1>
            <p className="text-gray-600">Permanently remove this tag from your library</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-red-200">
        <div className="p-6">
          <div className="text-center mb-6">
            <HiExclamation className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
            <p className="text-gray-600">This action cannot be undone.</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <HiTag className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Tag to be deleted:</span>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-medium bg-red-100 text-red-800">
              {tag.name}
            </span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiInformationCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Warning!</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  Deleting this tag will remove it from all associated games. This action is permanent and cannot be undone.
                </div>
              </div>
            </div>
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

          <div className="flex gap-3">
            <Button 
              onClick={handleDelete} 
              color="failure" 
              size="lg"
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <HiTrash className="w-4 h-4 mr-2" />
                  Yes, Delete Tag
                </>
              )}
            </Button>
            <Link to="/tags" className="flex-1">
              <button className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TagDelete;
