<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $trainers = User::where('role', 'trainer')->get();

        if ($trainers->isEmpty()) {
            return;
        }

        $courses = [
            [
                'title' => 'Yoga Basics',
                'description' => 'Einsteigerfreundlicher Yogakurs mit Fokus auf Beweglichkeit, Atmung und Entspannung.',
                'difficulty' => 'beginner',
                'max_capacity' => 12,
                'image_path' => 'https://i03.erlebnisgeschenke.de/products/image_3/298.jpg',
                'address' => 'Fitnessstudio Wien Mitte, Landstraßer Hauptstraße 1, 1030 Wien',
                'categories' => ['Yoga', 'Mobility', 'Stretching'],
            ],
            [
                'title' => 'Krafttraining Fundamentals',
                'description' => 'Grundlagen des Krafttrainings mit sauberer Technik, kontrollierten Bewegungen und Ganzkörperübungen.',
                'difficulty' => 'beginner',
                'max_capacity' => 10,
                'image_path' => 'https://cdn.book-family.de/fitbook/data/uploads/2025/12/30-minuten-krafttraining_gettyimages-2207770796.jpg?impolicy=smart-crop&width=992&height=558',
                'address' => 'Sportzentrum Margareten, Schönbrunner Straße 50, 1050 Wien',
                'categories' => ['Krafttraining', 'Functional Training'],
            ],
            [
                'title' => 'HIIT Advanced',
                'description' => 'Intensives Intervalltraining für Fortgeschrittene mit Fokus auf Kraftausdauer, Schnelligkeit und Belastbarkeit.',
                'difficulty' => 'advanced',
                'max_capacity' => 8,
                'image_path' => 'https://betterguards.de/cdn/shop/articles/Hiit_Training_041e9ea0-94ef-4ca1-9cac-cf590b0b5a81.jpg?v=1759818900&width=2048',
                'address' => 'Trainingshalle Prater, Hauptallee 20, 1020 Wien',
                'categories' => ['HIIT', 'Cardio', 'Functional Training'],
            ],
            [
                'title' => 'Pilates Core',
                'description' => 'Pilateskurs zur Stärkung der Körpermitte, Verbesserung der Haltung und Förderung stabiler Bewegungsmuster.',
                'difficulty' => 'intermediate',
                'max_capacity' => 14,
                'image_path' => 'https://storage.googleapis.com/msgsndr/QuFbRND35jJBaO8aq2To/media/6891a5a54f8b904d11d69490.png',
                'address' => 'Studio Neubau, Neubaugasse 15, 1070 Wien',
                'categories' => ['Pilates', 'Mobility'],
            ],
            [
                'title' => 'Mobility Flow',
                'description' => 'Fließende Mobility-Einheit zur Verbesserung der Gelenkbeweglichkeit, Körperkontrolle und aktiven Flexibilität.',
                'difficulty' => 'beginner',
                'max_capacity' => 16,
                'image_path' => 'https://www.forest-hill.fr/wp-content/uploads/2024/09/mobility-flow-2.webp',
                'address' => 'Bewegungsraum Josefstadt, Josefstädter Straße 32, 1080 Wien',
                'categories' => ['Mobility', 'Stretching'],
            ],
            [
                'title' => 'Functional Strength',
                'description' => 'Funktionelles Krafttraining mit Fokus auf alltagsnahe Bewegungen, Rumpfstabilität und koordinierte Belastung.',
                'difficulty' => 'intermediate',
                'max_capacity' => 10,
                'image_path' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh-NeDXpNKy9IUeAKbap7nWvB1_MLlVXp_gA&s',
                'address' => 'Urban Gym Alsergrund, Währinger Straße 18, 1090 Wien',
                'categories' => ['Functional Training', 'Krafttraining'],
            ],
            [
                'title' => 'Cardio Burn',
                'description' => 'Dynamischer Cardio-Kurs für mehr Ausdauer, Energieverbrauch und Herz-Kreislauf-Leistung.',
                'difficulty' => 'intermediate',
                'max_capacity' => 15,
                'image_path' => 'https://i.ytimg.com/vi/38EcEk33_-8/maxresdefault.jpg',
                'address' => 'Fitness Loft Leopoldstadt, Taborstraße 44, 1020 Wien',
                'categories' => ['Cardio', 'HIIT'],
            ],
            [
                'title' => 'Reha Rückenfit',
                'description' => 'Schonendes Training zur Stabilisierung des Rückens, Verbesserung der Haltung und kontrollierten Kräftigung.',
                'difficulty' => 'beginner',
                'max_capacity' => 8,
                'image_path' => 'https://www.club-eichenhof.de/wp-content/uploads/2019/10/kurs-reha-rueckengymnastic-club-ccm-fitness-hamburg-harburg-sevetal-maschen.jpg',
                'address' => 'Physiozentrum Wieden, Wiedner Hauptstraße 60, 1040 Wien',
                'categories' => ['Physio', 'Reha', 'Mobility'],
            ],
            [
                'title' => 'Kampfsport Conditioning',
                'description' => 'Athletiktraining für Kampfsport mit Fokus auf Koordination, Schnellkraft, Körperspannung und Ausdauer.',
                'difficulty' => 'advanced',
                'max_capacity' => 12,
                'image_path' => 'https://a.storyblok.com/f/183646/5358x3599/f2e156cfd8/karate-kampfsport-traumeel.jpeg/m/600x338/filters:quality(82)/',
                'address' => 'Dojo Favoriten, Favoritenstraße 130, 1100 Wien',
                'categories' => ['Kampfsport', 'Functional Training', 'Cardio'],
            ],
            [
                'title' => 'Dance Fitness',
                'description' => 'Musikbasierter Fitnesskurs mit einfachen Choreografien, Ausdauertraining und viel Bewegung.',
                'difficulty' => 'beginner',
                'max_capacity' => 18,
                'image_path' => 'https://www.c-and-a.com/image/upload/q_auto:good,ar_4:3,c_fill,g_auto:face,w_342/s/editorial/tanzen/tanzen-tanzen-als-fitnesskurs-text-media1.jpg',
                'address' => 'Dance Studio Mariahilf, Gumpendorfer Straße 70, 1060 Wien',
                'categories' => ['Tanz', 'Cardio'],
            ],
        ];

        foreach ($courses as $index => $courseData) {
            $categoryNames = $courseData['categories'];
            unset($courseData['categories']);

            $course = Course::create([
                ...$courseData,
                'trainer_id' => $trainers[$index % $trainers->count()]->id,
            ]);

            $categoryIds = Category::whereIn('name', $categoryNames)
                ->pluck('id')
                ->toArray();

            $course->categories()->sync($categoryIds);
        }
    }
}
