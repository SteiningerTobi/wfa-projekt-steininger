<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller für das Anzeigen, Erstellen und Stornieren von Buchungen.
 */
class BookingController extends Controller
{
    /**
     * Gibt alle Buchungen des aktuell eingeloggten Users zurück.
     */
    public function myBookings(): JsonResponse
    {
        $user = auth('api')->user();

        $bookings = Booking::with([
            'sessions.course',
        ])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($bookings);
    }

    /**
     * Erstellt eine neue Buchung für einen oder mehrere Termine.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_ids' => 'required|array|min:1',
            'session_ids.*' => 'exists:course_sessions,id',
        ]);

        $user = auth('api')->user();

        // Duplikate werden entfernt, damit derselbe Termin nicht mehrfach gebucht wird.
        $sessionIds = array_values(array_unique($validated['session_ids']));

        $sessions = \App\Models\CourseSession::with('course')
            ->whereIn('id', $sessionIds)
            ->get();

        // Verhindert, dass Trainer:innen eigene Kurstermine buchen.
        $ownCourseSessionIds = $sessions
            ->filter(fn ($session) => $session->course?->trainer_id === $user->id)
            ->pluck('id')
            ->values()
            ->all();

        if (!empty($ownCourseSessionIds)) {
            return response()->json([
                'message' => 'Trainer:innen können keine Termine eigener Kurse buchen.',
                'own_course_session_ids' => $ownCourseSessionIds,
            ], 403);
        }

        // Prüft, ob einer der gewünschten Termine bereits aktiv gebucht wurde.
        $alreadyBookedSessionIds = Booking::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->whereHas('sessions', function ($query) use ($sessionIds) {
                $query
                    ->whereIn('course_sessions.id', $sessionIds)
                    ->where('session_bookings.status', 'active');
            })
            ->with(['sessions' => function ($query) use ($sessionIds) {
                $query->whereIn('course_sessions.id', $sessionIds);
            }])
            ->get()
            ->flatMap(fn (Booking $booking) => $booking->sessions->pluck('id'))
            ->unique()
            ->values()
            ->all();

        if (!empty($alreadyBookedSessionIds)) {
            return response()->json([
                'message' => 'Ein oder mehrere Termine wurden bereits gebucht.',
                'already_booked_session_ids' => $alreadyBookedSessionIds,
            ], 409);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'status' => 'active',
        ]);

        // Erstellt für jeden ausgewählten Termin einen Eintrag in der Zwischentabelle.
        foreach ($sessionIds as $sessionId) {
            $booking->sessionBookings()->create([
                'session_id' => $sessionId,
                'status' => 'active',
                'cancelled_at' => null,
            ]);
        }

        return response()->json(
            $booking->load('sessions.course'),
            201
        );
    }

    /**
     * Storniert eine komplette Buchung inklusive aller aktiven Terminbuchungen.
     */
    public function cancel(int $id): JsonResponse
    {
        $user = auth('api')->user();

        $booking = Booking::with('sessionBookings')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Buchung wurde nicht gefunden.',
            ], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'Diese Buchung wurde bereits storniert.',
            ], 409);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        // Setzt alle aktiven Termine dieser Buchung ebenfalls auf storniert.
        $booking->sessionBookings()
            ->where('status', 'active')
            ->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

        return response()->json([
            'message' => 'Buchung wurde erfolgreich storniert.',
            'booking' => $booking->fresh()->load('sessions.course'),
        ]);
    }

    /**
     * Storniert einen einzelnen Termin innerhalb einer Buchung.
     */
    public function cancelSession(int $bookingId, int $sessionId): JsonResponse
    {
        $user = auth('api')->user();

        $booking = Booking::query()
            ->where('id', $bookingId)
            ->where('user_id', $user->id)
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Buchung wurde nicht gefunden.',
            ], 404);
        }

        $sessionBooking = \App\Models\SessionBooking::query()
            ->where('booking_id', $bookingId)
            ->where('session_id', $sessionId)
            ->first();

        if (!$sessionBooking) {
            return response()->json([
                'message' => 'Terminbuchung wurde nicht gefunden.',
            ], 404);
        }

        if ($sessionBooking->status === 'cancelled') {
            return response()->json([
                'message' => 'Dieser Termin wurde bereits storniert.',
            ], 409);
        }

        \App\Models\SessionBooking::query()
            ->where('booking_id', $bookingId)
            ->where('session_id', $sessionId)
            ->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'updated_at' => now(),
            ]);

        // Wenn keine aktiven Termine mehr übrig sind, wird auch die Gesamtbuchung storniert.
        $hasActiveSessions = \App\Models\SessionBooking::query()
            ->where('booking_id', $bookingId)
            ->where('status', 'active')
            ->exists();

        if (!$hasActiveSessions) {
            $booking->update([
                'status' => 'cancelled',
            ]);
        }

        return response()->json([
            'message' => 'Termin wurde erfolgreich storniert.',
            'booking' => $booking->fresh()->load('sessions.course'),
        ]);
    }
}
