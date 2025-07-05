import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TagEdit() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/tags/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update tag');
        return;
      }
      navigate('/tags');
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit Tag</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}

export default TagEdit;
