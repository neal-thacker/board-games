import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { Link } from 'react-router-dom';
import { Button, Spinner, TextInput, Card, Pagination } from 'flowbite-react';
import { HiPlus, HiTag, HiSearch } from 'react-icons/hi';

function TagsList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTags, setTotalTags] = useState(0);
  const [perPage] = useState(12);

  const fetchTags = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...(search && { search })
      });
      
      const response = await apiFetch(`/tags?${params}`);
      const data = await response.json();
      
      setTags(data.data || []);
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
      setTotalTags(data.total || 0);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTags(1, searchQuery);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If search is cleared, fetch all tags
    if (value === '') {
      setCurrentPage(1);
      fetchTags(1, '');
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && currentPage === 1) {
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
    <div className="w-full mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HiTag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
            <p className="text-gray-600">Organize your board games with tags</p>
          </div>
        </div>
      </div>

      {/* Search and Create Section */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <form onSubmit={handleSearch} className="w-full mr-2">
              <div className="relative">
                <TextInput
                  icon={HiSearch}
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full"
                />
              </div>
            </form>

            <Link to="/tags/create">
              <Button color="blue" size="md">
                <HiPlus className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Add</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-12">
              <HiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No tags found' : 'No tags yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No tags match your search "${searchQuery}".` 
                  : 'Get started by creating your first tag to organize your games.'
                }
              </p>
              {!searchQuery && (
                <Link to="/tags/create">
                  <Button color="blue">
                    <HiPlus className="w-4 h-4 mr-2" />
                    Create First Tag
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {tags.map(tag => (
                  <Link key={tag.id} to={`/tags/${tag.id}`} className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-indigo-200">
                      <div className="text-center p-2">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {tag.name}
                        </h3>
                        
                        <p className="text-sm text-gray-400 uppercase">
                          {tag.games_count || 0} game{(tag.games_count || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TagsList;
