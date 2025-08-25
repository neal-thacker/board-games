import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiTag } from 'react-icons/hi';

function TagsList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/tags')
      .then(res => res.json())
      .then(data => {
        setTags(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HiTag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags Management</h1>
            <p className="text-gray-600">Organize your board games with custom tags</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">All Tags</h2>
            <Link to="/tags/create">
            <Button color="blue" size="md">
              <HiPlus className="w-4 h-4" />
            </Button>
          </Link>
          </div>
          
          {tags.length === 0 ? (
            <div className="text-center py-12">
              <HiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tags yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first tag to organize your games.</p>
              <Link to="/tags/create">
                <Button color="blue">
                  <HiPlus className="w-4 h-4 mr-2" />
                  Create First Tag
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tag Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map(tag => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{tag.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {tag.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link to={`/tags/${tag.id}/edit`}>
                            <button className="inline-flex items-center px-3 py-1 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                              <HiPencil className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                          </Link>
                          <Link to={`/tags/${tag.id}/delete`}>
                            <button className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              <HiTrash className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TagsList;
