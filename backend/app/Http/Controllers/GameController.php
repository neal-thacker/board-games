<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // Display a listing of the games
    public function index()
    {
        return Game::all();
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
        return Game::create($validated);
    }

    // Display the specified game
    public function show(Game $game)
    {
        return $game;
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
        return $game;
    }

    // Remove the specified game
    public function destroy(Game $game)
    {
        $game->delete();
        return response()->noContent();
    }
}
