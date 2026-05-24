<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSession;
use Illuminate\Http\Request;

/**
 * Controller für das Anzeigen, Erstellen, Bearbeiten und Löschen von Kursterminen.
 */
class CourseSessionController extends Controller
{
    /**
     * Gibt alle Termine eines bestimmten Kurses zurück.
     */
    public function index($id)
    {
        $course = Course::findOrFail($id);

        return response()->json(
            $course->sessions()
                ->orderBy('start_date')
                ->get()
        );
    }

    /**
     * Erstellt einen neuen Termin für einen Kurs.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'start_date' => ['required', 'date'],
            'duration' => ['required', 'integer', 'min:1'],
        ]);

        $session = CourseSession::create($validated);

        return response()->json($session, 201);
    }

    /**
     * Aktualisiert einen bestehenden Kurstermin.
     */
    public function update(Request $request, $id)
    {
        $session = CourseSession::findOrFail($id);

        $validated = $request->validate([
            'start_date' => ['required', 'date'],
            'duration' => ['required', 'integer', 'min:1'],
        ]);

        $session->update($validated);

        return response()->json($session);
    }

    /**
     * Löscht einen Kurstermin.
     */
    public function destroy($id)
    {
        $session = CourseSession::findOrFail($id);
        $session->delete();

        return response()->json(null, 204);
    }

    /**
     * Gibt die Teilnehmer:innen eines bestimmten Termins zurück.
     */
    public function participants($courseId, $sessionId)
    {
        $course = Course::findOrFail($courseId);

        if ((int) $course->trainer_id !== (int) auth()->id()) {
            return response()->json([
                'message' => 'Du darfst diese Teilnehmerliste nicht einsehen.'
            ], 403);
        }

        $session = CourseSession::with(['bookings.user'])
            ->where('course_id', $course->id)
            ->findOrFail($sessionId);

        // Reduziert die Buchungsdaten auf die relevanten Teilnehmerinformationen.
        $participants = $session->bookings->map(function ($booking) {
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
        })->values();

        return response()->json([
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
            ],
            'session' => [
                'id' => $session->id,
                'start_date' => $session->start_date,
                'duration' => $session->duration,
                'status' => $session->status ?? null,
            ],
            'participants' => $participants,
        ]);
    }
}
