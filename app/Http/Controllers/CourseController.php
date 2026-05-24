<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

/**
 * Controller für das Anzeigen, Erstellen, Bearbeiten und Löschen von Kursen.
 */
class CourseController extends Controller
{
    /**
     * Definiert die Relationen, die bei Kursabfragen mitgeladen werden.
     */
    private function courseRelations(): array
    {
        return [
            'categories',
            'trainer.trainerData',
            'sessions' => function ($query) {
                // Zählt nur aktive Buchungen pro Termin.
                $query->withCount([
                    'sessionBookings as booked_count' => function ($query) {
                        $query->where('status', 'active');
                    }
                ]);
            }
        ];
    }

    /**
     * Gibt alle Kurse inklusive Kategorien, Trainerdaten und Terminen zurück.
     */
    public function index(): JsonResponse
    {
        // Aktualisiert vergangene Termine, bevor Kurse ausgegeben werden.
        CourseSession::updatePastSessions();

        $courses = Course::with($this->courseRelations())->get();

        return response()->json($courses);
    }

    /**
     * Gibt einen einzelnen Kurs anhand seiner ID zurück.
     */
    public function show($id): JsonResponse
    {
        CourseSession::updatePastSessions();

        $course = Course::with($this->courseRelations())->find($id);

        if (!$course) {
            return response()->json([
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json($course);
    }

    /**
     * Erstellt einen neuen Kurs für den eingeloggten Trainer.
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($user->role !== 'trainer') {
            return response()->json([
                'message' => 'Nur Trainer:innen können Kurse erstellen.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'max_capacity' => 'required|integer|min:1',
            'image_path' => 'nullable|string|max:2048',
            'address' => 'required|string|max:255',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Kategorien werden separat gespeichert, weil sie über eine Pivot-Tabelle verknüpft sind.
        $categoryIds = $validated['category_ids'];
        unset($validated['category_ids']);

        $validated['trainer_id'] = $user->id;

        $course = Course::create($validated);

        $course->categories()->sync($categoryIds);

        return response()->json(
            $course->load($this->courseRelations()),
            201
        );
    }

    /**
     * Aktualisiert einen bestehenden Kurs.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'message' => 'Course not found'
            ], 404);
        }

        if ((int) $course->trainer_id !== (int) $user->id) {
            return response()->json([
                'message' => 'Du darfst nur eigene Kurse bearbeiten.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',

                // Titel muss eindeutig bleiben, ignoriert aber den aktuellen Kurs.
                Rule::unique('courses', 'title')->ignore($course->id),
            ],
            'description' => 'sometimes|required|string',
            'difficulty' => 'sometimes|required|in:beginner,intermediate,advanced',
            'max_capacity' => 'sometimes|required|integer|min:1',
            'image_path' => 'nullable|string|max:2048',
            'address' => 'sometimes|required|string|max:255',
            'category_ids' => 'sometimes|required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $categoryIds = $validated['category_ids'] ?? null;
        unset($validated['category_ids']);

        $course->update($validated);

        // Kategorien werden nur aktualisiert, wenn sie im Request enthalten sind.
        if ($categoryIds !== null) {
            $course->categories()->sync($categoryIds);
        }

        return response()->json(
            $course->load($this->courseRelations())
        );
    }

    /**
     * Löscht einen Kurs anhand seiner ID.
     */
    public function destroy($id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'message' => 'Course not found'
            ], 404);
        }

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    /**
     * Gibt die Teilnehmer:innen pro Termin eines Kurses zurück.
     */
    public function participants($id): JsonResponse
    {
        $course = Course::with([
            'sessions.bookings.user'
        ])->findOrFail($id);

        if ($course->trainer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Du darfst die Teilnehmerliste dieses Kurses nicht einsehen.'
            ], 403);
        }

        $sessions = $course->sessions
            ->sortBy('start_date')
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'start_date' => $session->start_date,
                    'duration' => $session->duration,
                    'status' => $session->status ?? null,

                    // Reduziert die Buchungsdaten auf die relevanten Teilnehmerinformationen.
                    'participants' => $session->bookings->map(function ($booking) {
                        return [
                            'booking_id' => $booking->id,
                            'booking_status' => $booking->status,
                            'participant_status' => $booking->pivot->status ?? null,
                            'booked_at' => $booking->created_at,
                            'user' => [
                                'id' => $booking->user?->id,
                                'user_name' => $booking->user?->user_name,
                                'email' => $booking->user?->email,
                            ],
                        ];
                    })->values(),
                ];
            })
            ->values();

        return response()->json([
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
            ],
            'sessions' => $sessions,
        ]);
    }
}
