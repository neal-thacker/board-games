<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // Display a listing of the games
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12); // Default 12 games per page
        $page = $request->get('page', 1);
        $search = $request->get('search');
        $tagIds = $request->get('tag_ids', []);
        $playerCount = $request->get('player_count');
        $minAge = $request->get('min_age');

        $query = Game::with('tags');
        
        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('tags', function ($tagQuery) use ($search) {
                      $tagQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply tag filter: must have ALL the tags provided
        if (!empty($tagIds)) {
            foreach ($tagIds as $tagId) {
                $query->whereHas('tags', function ($tagQuery) use ($tagId) {
                    $tagQuery->where('tags.id', $tagId);
                });
            }
        }
        
        // Apply player count filter: check if the given player count falls within the game's range
        if ($playerCount !== null && $playerCount !== '') {
            $query->where('player_min', '<=', (int)$playerCount)
              ->where(function ($q) use ($playerCount) {
                    $q->whereNull('player_max')
                    ->orWhere('player_max', '>=', (int)$playerCount);
              });
        }
        
        // Apply minimum age filter: game's min_age should be less than or equal to the specified age
        if ($minAge !== null && $minAge !== '') {
            $query->where(function ($q) use ($minAge) {
                $q->whereNull('min_age')
                  ->orWhere('min_age', '<=', (int)$minAge);
            });
        }
        
        $games = $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
        
        return response()->json([
            'data' => $games->items(),
            'current_page' => $games->currentPage(),
            'last_page' => $games->lastPage(),
            'per_page' => $games->perPage(),
            'total' => $games->total(),
            'has_more' => $games->hasMorePages()
        ], 200);
    }

    // Store a newly created game
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'player_min' => 'required|integer|min:1',
            'player_max' => 'required|integer|min:1',
            'estimated_time' => 'required|integer|min:1',
            'min_age' => 'nullable|integer|min:0',
        ]);
        $game = Game::create($validated);
        return Game::with('tags')->find($game->id);
    }

    // Display the specified game
    public function show(Game $game)
    {
        return $game->load('tags');
    }

    // Update the specified game
    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'player_min' => 'sometimes|required|integer|min:1',
            'player_max' => 'sometimes|required|integer|min:1',
            'estimated_time' => 'sometimes|required|integer|min:1',
            'min_age' => 'nullable|integer|min:0',
        ]);
        $game->update($validated);
        return $game->load('tags');
    }

    // Remove the specified game
    public function destroy(Game $game)
    {
        $game->delete();
        return response()->noContent();
    }

    // Get player count statistics for filter bounds
    public function playerStats()
    {
        $minPlayers = Game::min('player_min') ?: 1;
        $maxPlayers = Game::max('player_max') ?: 10;
        
        return response()->json([
            'min_players' => (int)$minPlayers,
            'max_players' => (int)$maxPlayers,
            'suggested_default' => (int)ceil(($minPlayers + $maxPlayers) / 2)
        ]);
    }

    // Get age statistics for filter bounds
    public function ageStats()
    {
        return response()->json([
            'min_age' => 1,
            'max_age' => 18,
            'suggested_default' => 8
        ]);
    }
}
