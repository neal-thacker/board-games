<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\GameTagController;

Route::apiResource('games', GameController::class);
Route::get('games-player-stats', [GameController::class, 'playerStats']);
Route::get('games-age-stats', [GameController::class, 'ageStats']);
Route::apiResource('tags', TagController::class);
Route::post('games/{game}/tags/{tag}', [GameTagController::class, 'attach']);
Route::delete('games/{game}/tags/{tag}', [GameTagController::class, 'detach']);
