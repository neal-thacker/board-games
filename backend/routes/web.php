<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TagController;

Route::resource('games', GameController::class);
Route::resource('tags', TagController::class);