<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\GameTagController;

Route::resource('games', GameController::class);
Route::resource('tags', TagController::class);
Route::post('games/{game}/tags/{tag}', [GameTagController::class, 'attach']);
Route::delete('games/{game}/tags/{tag}', [GameTagController::class, 'detach']);