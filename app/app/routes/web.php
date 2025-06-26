<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/games', function () {
    return response([
        ['id' => 1, 'name' => 'Catan'],
        ['id' => 2, 'name' => 'Ticket to Ride'],
        ['id' => 3, 'name' => 'Carcassonne'],
    ])->header('Access-Control-Allow-Origin', 'http://localhost:3000')
      ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
