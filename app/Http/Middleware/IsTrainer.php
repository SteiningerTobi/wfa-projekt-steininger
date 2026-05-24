<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware, die den Zugriff auf Trainer:innen beschränkt.
 */
class IsTrainer
{
    /**
     * Prüft, ob der aktuelle User eingeloggt ist und die Rolle "trainer" hat.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if ($user->role !== 'trainer') {
            return response()->json([
                'message' => 'Nur Trainer:innen dürfen diese Aktion ausführen.'
            ], 403);
        }

        return $next($request);
    }
}
