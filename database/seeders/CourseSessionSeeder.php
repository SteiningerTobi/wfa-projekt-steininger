<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSession;
use Illuminate\Database\Seeder;

class CourseSessionSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        if ($courses->isEmpty()) {
            return;
        }

        $sessionPlans = [
            [
                ['days' => 3, 'hour' => 18, 'minute' => 0, 'duration' => 60],
                ['days' => 10, 'hour' => 18, 'minute' => 0, 'duration' => 60],
                ['days' => 17, 'hour' => 18, 'minute' => 0, 'duration' => 75],
            ],
            [
                ['days' => 4, 'hour' => 17, 'minute' => 30, 'duration' => 60],
                ['days' => 11, 'hour' => 17, 'minute' => 30, 'duration' => 60],
            ],
            [
                ['days' => 2, 'hour' => 19, 'minute' => 0, 'duration' => 45],
                ['days' => 6, 'hour' => 19, 'minute' => 0, 'duration' => 45],
                ['days' => 13, 'hour' => 19, 'minute' => 0, 'duration' => 60],
                ['days' => 20, 'hour' => 19, 'minute' => 0, 'duration' => 60],
            ],
            [
                ['days' => 5, 'hour' => 16, 'minute' => 0, 'duration' => 75],
                ['days' => 12, 'hour' => 16, 'minute' => 0, 'duration' => 75],
                ['days' => 19, 'hour' => 16, 'minute' => 0, 'duration' => 75],
                ['days' => 26, 'hour' => 16, 'minute' => 0, 'duration' => 90],
                ['days' => 33, 'hour' => 16, 'minute' => 0, 'duration' => 90],
            ],
            [
                ['days' => 7, 'hour' => 10, 'minute' => 0, 'duration' => 60],
                ['days' => 14, 'hour' => 10, 'minute' => 0, 'duration' => 60],
                ['days' => 21, 'hour' => 10, 'minute' => 0, 'duration' => 60],
            ],
        ];

        foreach ($courses as $index => $course) {
            $plan = $sessionPlans[$index % count($sessionPlans)];

            foreach ($plan as $session) {
                CourseSession::create([
                    'course_id' => $course->id,
                    'start_date' => now()
                        ->addDays($session['days'])
                        ->setTime($session['hour'], $session['minute']),
                    'duration' => $session['duration'],
                    'status' => 'planned',
                ]);
            }
        }
    }
}
