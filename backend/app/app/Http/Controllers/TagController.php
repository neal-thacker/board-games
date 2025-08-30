<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $query = Tag::query()->withCount('games');
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%$search%");
        }
        
        // If 'all' parameter is present, return all results without pagination
        if ($request->boolean('all')) {
            return $query->get();
        }
        
        $perPage = $request->input('per_page', 12);
        return $query->paginate($perPage);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);
        return Tag::create($validated);
    }

    public function show(Tag $tag)
    {
        return $tag->load('games');
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:tags,name,' . $tag->id,
        ]);
        $tag->update($validated);
        return $tag;
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();
        return response()->noContent();
    }
}
