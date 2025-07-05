import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TagCreate() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to create tag');
        return;
      }
      navigate('/tags');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add Tag</h1>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}

export default TagCreate;
