<?php

namespace Database\Seeders;

use Database\Seeders\GameTagSeeder;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(GameTagSeeder::class);
    }
}
