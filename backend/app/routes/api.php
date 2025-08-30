<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\GameTagController;
use App\Http\Controllers\AuthController;

// Authentication routes (public)
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/guest', [AuthController::class, 'guest']);
Route::get('auth/verify', [AuthController::class, 'verify']);

// Public read-only routes
Route::get('games', [GameController::class, 'index']);
Route::get('games/{game}', [GameController::class, 'show']);
Route::get('games-player-stats', [GameController::class, 'playerStats']);
Route::get('games-age-stats', [GameController::class, 'ageStats']);
Route::get('tags', [TagController::class, 'index']);
Route::get('tags/{tag}', [TagController::class, 'show']);

// Admin-only routes (protected)
Route::middleware('admin.auth')->group(function () {
    Route::post('games', [GameController::class, 'store']);
    Route::put('games/{game}', [GameController::class, 'update']);
    Route::delete('games/{game}', [GameController::class, 'destroy']);
    
    Route::post('tags', [TagController::class, 'store']);
    Route::put('tags/{tag}', [TagController::class, 'update']);
    Route::delete('tags/{tag}', [TagController::class, 'destroy']);
    
    Route::post('games/{game}/tags/{tag}', [GameTagController::class, 'attach']);
    Route::delete('games/{game}/tags/{tag}', [GameTagController::class, 'detach']);
});

Route::get('/server-info', function (Request $request) {
    return response()->json([
        'ip' => $request->server('SERVER_ADDR') ?? gethostbyname(gethostname()),
        'host' => gethostname(),
    ]);
});
