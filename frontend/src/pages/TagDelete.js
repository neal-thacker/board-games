import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TagDelete() {
  const { id } = useParams();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/tags/${id}`)
      .then(res => res.json())
      .then(data => {
        setTag(data);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/tags/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        setError('Failed to delete tag');
        return;
      }
      navigate('/tags');
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!tag) return <div>Tag not found.</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Delete Tag</h1>
      <p>Are you sure you want to delete the tag <span className="font-semibold">{tag.name}</span>?</p>
      {error && <div className="text-red-500 my-2">{error}</div>}
      <div className="mt-4 flex gap-2">
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        <button onClick={() => navigate('/tags')} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

export default TagDelete;
