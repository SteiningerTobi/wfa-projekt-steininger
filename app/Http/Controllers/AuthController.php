<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Controller für Registrierung, Login, Logout und JWT-Tokenverwaltung.
 */
class AuthController extends Controller
{
    /**
     * Registriert einen neuen Benutzer.
     */
    public function register(Request $request): JsonResponse
    {
        // Prüft die Registrierungsdaten, bevor ein User angelegt wird.
        $request->validate([
            'user_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,trainer',
        ]);

        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,

            // Passwort wird gehasht und nicht im Klartext gespeichert.
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    /**
     * Meldet einen Benutzer an und gibt bei Erfolg einen JWT-Token zurück.
     */
    public function login(): JsonResponse
    {
        $credentials = request(['email', 'password']);

        // Login-Versuch über den API-Guard; bei Fehler wird 401 zurückgegeben.
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'E-Mail oder Passwort ist falsch.',
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Gibt den aktuell eingeloggten Benutzer zurück.
     */
    public function me(): JsonResponse
    {
        $user = auth('api')->user();

        if ($user) {
            // Lädt zugehörige Trainerdaten mit, falls vorhanden.
            $user->load('trainerData');
        }

        return response()->json($user);
    }

    /**
     * Loggt den aktuellen Benutzer aus.
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Erfolgreich ausgeloggt.',
        ]);
    }

    /**
     * Erneuert den aktuellen JWT-Token.
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Erstellt die einheitliche JSON-Antwort für Login und Token-Refresh.
     */
    protected function respondWithToken(string $token): JsonResponse
    {
        $user = auth('api')->user();

        if ($user) {
            $user->load('trainerData');
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',

            // TTL wird von Minuten in Sekunden umgerechnet.
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user,
        ]);
    }
}
