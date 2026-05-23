<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Booking;
use App\Models\CourseSession;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            $availableSessions = CourseSession::with('course')
                ->get()
                ->filter(function ($session) use ($user) {
                    if (!$session->course) {
                        return false;
                    }

                    if ($user->role === 'trainer') {
                        return (int) $session->course->trainer_id !== (int) $user->id;
                    }

                    return true;
                })
                ->values();

            if ($availableSessions->isEmpty()) {
                continue;
            }

            $booking = Booking::create([
                'user_id' => $user->id,
                'status' => 'active',
            ]);

            $sessionCount = min(
                rand(1, 4),
                $availableSessions->count()
            );

            $randomSessions = $availableSessions->random($sessionCount);

            foreach ($randomSessions as $session) {
                $booking->sessions()->attach($session->id, [
                    'status' => 'active',
                    'cancelled_at' => null,
                ]);
            }
        }
    }
}
