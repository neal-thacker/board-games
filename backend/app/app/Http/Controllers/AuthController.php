<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Verify admin password and return auth status
     */
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $adminPassword = env('ADMIN_PASSWORD');
        $inputPassword = $request->input('password');

        if ($inputPassword === $adminPassword) {
            // Generate a simple token (in a real app, use proper JWT or Laravel Sanctum)
            $token = Hash::make($adminPassword . time());
            
            return response()->json([
                'success' => true,
                'role' => 'admin',
                'token' => $token,
                'message' => 'Admin authentication successful'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid admin password'
        ], 401);
    }

    /**
     * Continue as guest
     */
    public function guest()
    {
        return response()->json([
            'success' => true,
            'role' => 'guest',
            'token' => null,
            'message' => 'Continuing as guest'
        ]);
    }

    /**
     * Verify current authentication status
     */
    public function verify(Request $request)
    {
        $token = $request->header('Authorization');
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'role' => 'guest',
                'message' => 'No authentication token provided'
            ]);
        }

        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);

        // For this simple implementation, we'll just check if token exists
        // In a real app, you'd validate the JWT or check against a database
        if ($token && strlen($token) > 10) {
            return response()->json([
                'success' => true,
                'role' => 'admin',
                'message' => 'Admin authenticated'
            ]);
        }

        return response()->json([
            'success' => false,
            'role' => 'guest',
            'message' => 'Invalid or expired token'
        ]);
    }
}
