<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Yoga',
            'Pilates',
            'Krafttraining',
            'Functional Training',
            'HIIT',
            'Cardio',
            'Mobility',
            'Stretching',
            'Physio',
            'Reha',
            'Kampfsport',
            'Tanz',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate(['name' => $name]);
        }
    }
}
