<?php

namespace Database\Factories;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

class GameFactory extends Factory
{
    protected $model = Game::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->words(2, true),
            'description' => $this->faker->sentence(),
            'player_min' => $this->faker->numberBetween(1, 2),
            'player_max' => $this->faker->numberBetween(3, 8),
            'estimated_time' => $this->faker->numberBetween(15, 180),
        ];
    }
}
