<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TrainerDataSeeder::class,
            CategorySeeder::class,
            CourseSeeder::class,
            CourseCategorySeeder::class,
            CourseSessionSeeder::class,
            BookingSeeder::class,
        ]);
    }
}
