import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { Link } from 'react-router-dom';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Link to="/tags/create" className="bg-blue-500 text-white px-4 py-2 rounded">Add Tag</Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map(tag => (
            <tr key={tag.id}>
              <td className="py-2 px-4 border-b">{tag.id}</td>
              <td className="py-2 px-4 border-b">{tag.name}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/tags/${tag.id}/edit`} className="text-blue-500 mr-2">Edit</Link>
                <Link to={`/tags/${tag.id}/delete`} className="text-red-500">Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TagsList;
