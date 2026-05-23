<?php
//
//namespace App\Http\Controllers;
//
//use App\Models\User;
//use App\Models\TrainerData;
//use Illuminate\Http\JsonResponse;
//use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Hash;
//use Illuminate\Support\Facades\Validator;
//
//class AuthController extends Controller
//{
//    public function register(Request $request): JsonResponse
//    {
//        $validated = $request->validate([
//            'user_name' => 'required|string|max:255',
//            'email' => 'required|string|email|max:255|unique:users,email',
//            'password' => 'required|string|min:6',
//            'role' => 'required|in:participant,trainer',
//
//            'trainer_data' => 'nullable|array',
//            'trainer_data.name' => 'nullable|string|max:255',
//            'trainer_data.bio' => 'nullable|string',
//            'trainer_data.phone' => 'nullable|string|max:255',
//            'trainer_data.profile_image' => 'nullable|string|max:255',
//            'trainer_data.contact_mail' => 'nullable|string|email|max:255',
//        ]);
//
//        $user = User::create([
//            'user_name' => $validated['user_name'],
//            'email' => $validated['email'],
//            'password' => Hash::make($validated['password']),
//            'role' => $validated['role'],
//        ]);
//
//        if ($user->role === 'trainer' && isset($validated['trainer_data'])) {
//            TrainerData::create([
//                'user_id' => $user->id,
//                'name' => $validated['trainer_data']['name'] ?? $user->user_name,
//                'bio' => $validated['trainer_data']['bio'] ?? null,
//                'phone' => $validated['trainer_data']['phone'] ?? null,
//                'profile_image' => $validated['trainer_data']['profile_image'] ?? null,
//                'contact_mail' => $validated['trainer_data']['contact_mail'] ?? $user->email,
//            ]);
//        }
//
//        $token = auth()->login($user);
//
//        return $this->respondWithToken($token);
//    }
//
//    public function login(Request $request): JsonResponse
//    {
//        $credentials = $request->validate([
//            'email' => 'required|string|email',
//            'password' => 'required|string',
//        ]);
//
//        if (!$token = auth()->attempt($credentials)) {
//            return response()->json([
//                'message' => 'E-Mail oder Passwort ist falsch.'
//            ], 401);
//        }
//
//        return $this->respondWithToken($token);
//    }
//
//    public function me(): JsonResponse
//    {
//        $user = auth()->user();
//
//        $user->load('trainerData');
//
//        return response()->json($user);
//    }
//
//    public function logout(): JsonResponse
//    {
//        auth()->logout();
//
//        return response()->json([
//            'message' => 'Successfully logged out'
//        ]);
//    }
//
//    public function refresh(): JsonResponse
//    {
//        return $this->respondWithToken(auth()->refresh());
//    }
//
//    protected function respondWithToken(string $token): JsonResponse
//    {
//        $user = auth()->user();
//
//        if ($user) {
//            $user->load('trainerData');
//        }
//
//        return response()->json([
//            'access_token' => $token,
//            'token_type' => 'bearer',
//            'expires_in' => auth()->factory()->getTTL() * 60,
//            'user' => $user,
//        ]);
//    }
//}


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'user_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,trainer',
        ]);

        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    public function login(): JsonResponse
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'E-Mail oder Passwort ist falsch.',
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    public function me(): JsonResponse
    {
        $user = auth('api')->user();

        if ($user) {
            $user->load('trainerData');
        }

        return response()->json($user);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Erfolgreich ausgeloggt.',
        ]);
    }

    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    protected function respondWithToken(string $token): JsonResponse
    {
        $user = auth('api')->user();

        if ($user) {
            $user->load('trainerData');
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user,
        ]);
    }
}
