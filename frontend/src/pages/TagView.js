import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { Card, Button, Spinner, Badge, TextInput } from 'flowbite-react';
import { HiArrowLeft, HiPencil, HiTrash, HiTag, HiCheck, HiX } from 'react-icons/hi';
import GameCard from './GameCard';

function TagView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiFetch(`/tags/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Tag not found');
        }
        return res.json();
      })
      .then(data => {
        setTag(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      try {
        const response = await apiFetch(`/tags/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          navigate('/tags');
        } else {
          throw new Error('Failed to delete tag');
        }
      } catch (err) {
        alert('Error deleting tag: ' + err.message);
      }
    }
  };

  const handleEditClick = () => {
    setEditingName(tag.name);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editingName.trim() === '') {
      alert('Tag name cannot be empty');
      return;
    }

    if (editingName.trim() === tag.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiFetch(`/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (response.ok) {
        const updatedTag = await response.json();
        setTag(updatedTag);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tag');
      }
    } catch (err) {
      alert('Error updating tag: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingName(tag.name);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading tag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto">
        <div className="mb-6">
          <Link to="/tags">
            <Button color="light" size="sm">
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Back to Tags
            </Button>
          </Link>
        </div>
        <Card className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <HiTag className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tag Not Found</h3>
            <p className="text-gray-600 mb-6">The tag you're looking for doesn't exist or may have been deleted.</p>
            <Link to="/tags">
              <Button color="blue">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Back to Tags
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <Link to="/tags">
          <Button color="light" size="sm">
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Back to Tags
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-2">
          {isEditing ? (
            <div className="mb-6">
              <div className="flex flex-wrap max-w-md mx-auto">
                <TextInput
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Tag name"
                  className="w-full"
                  disabled={isSaving}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-4 w-full mt-2">
                  <Button
                    color="green"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full max-w-sm"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <HiCheck className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    color="light"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="w-full max-w-sm"
                  >
                    <HiX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <Badge color="indigo" size="lg" className="inline-block rounded-lg text-lg">
                {tag.name}
              </Badge>
            </div>
          )}

          {!isEditing && (
            <div className="mt-4 flex gap-4 justify-center">
              <Button
                  color="blue"
                  size="md"
                  onClick={handleEditClick}
                  className="w-auto"
                >
                <HiPencil className="w-5 h-5 mr-2" />
                Edit
              </Button>
            
              <Button color="red" size="md" onClick={handleDelete} className="w-auto">
                <HiTrash className="w-5 h-5 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-500">
            {tag.created_at && (
              <p><strong>Created:</strong> {new Date(tag.created_at).toLocaleDateString()}</p>
            )}
            {tag.updated_at && (
              <p><strong>Last Updated:</strong> {new Date(tag.updated_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Games Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Games with this tag
          {tag.games && tag.games.length > 0 && (
            <Badge color="purple" size="sm" className="inline-flex ml-2 font-bold">
              {tag.games.length}
            </Badge>
          )}
        </h2>
        
        {tag.games && tag.games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tag.games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <div className="text-center py-8">
              <HiTag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Games Yet</h3>
              <p className="text-gray-600 mb-4">This tag hasn't been assigned to any games yet.</p>
              <Link to="/games/create">
                <Button color="blue" size="sm">
                  Add New Game
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TagView;
