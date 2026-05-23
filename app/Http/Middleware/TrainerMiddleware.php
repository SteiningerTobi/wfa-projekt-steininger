<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TrainerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (! $user || $user->role !== 'trainer') {
            return response()->json([
                'message' => 'Only trainers are allowed to access this resource.',
            ], 403);
        }

        return $next($request);
    }
}
