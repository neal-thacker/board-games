<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('Authorization');
        
        if (!$token) {
            return response()->json([
                'error' => 'Admin authentication required',
                'message' => 'This action requires admin privileges'
            ], 403);
        }

        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);

        // For this simple implementation, we'll just check if token exists and has reasonable length
        // In a real app, you'd validate the JWT or check against a database
        if (!$token || strlen($token) < 10) {
            return response()->json([
                'error' => 'Invalid authentication token',
                'message' => 'This action requires admin privileges'
            ], 403);
        }

        return $next($request);
    }
}
