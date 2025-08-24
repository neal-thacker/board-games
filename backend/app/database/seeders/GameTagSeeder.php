<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Tag;

class GameTagSeeder extends Seeder
{
    public function run(): void
    {
        // Create tags
        $tags = Tag::factory(10)->create();
        // Create games
        $games = Game::factory(50)->create();

        // Attach random tags to each game
        foreach ($games as $game) {
            $game->tags()->attach(
                $tags->random(rand(1, 3))->pluck('id')->toArray()
            );
        }
    }
}
