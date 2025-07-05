<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Tag;
use Illuminate\Http\Request;

class GameTagController extends Controller
{
    // Attach a tag to a game (RESTful, tag from route)
    public function attach(Game $game, Tag $tag)
    {
        $game->tags()->attach($tag->id);
        return response()->json(['message' => 'Tag attached successfully.']);
    }

    // Detach a tag from a game (RESTful, tag from route)
    public function detach(Game $game, Tag $tag)
    {
        $game->tags()->detach($tag->id);
        return response()->json(['message' => 'Tag detached successfully.']);
    }
}
