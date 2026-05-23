<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TrainerData;
use Illuminate\Database\Seeder;

class TrainerDataSeeder extends Seeder
{
    public function run(): void
    {
        $trainerData = [
            'Luke Cage' => [
                'bio' => 'Spezialisiert auf funktionelles Krafttraining, Mobility und belastbare Trainingsroutinen für Alltag und Sport. Luke arbeitet ruhig, direkt und legt großen Wert auf saubere Technik.',
                'phone' => '+43 660 184 2210',
                'profile_image' => 'https://id-serienjunkies-production.s3.eu-central-1.amazonaws.com/s-cdn-sj/luke-cage/hdtv.webp',
            ],
            'Jessica Jones' => [
                'bio' => 'Fokus auf Kraftaufbau, Core-Stabilität und mental starke Trainingspläne. Jessica trainiert bevorzugt in kleinen Gruppen und passt Übungen pragmatisch an jedes Fitnesslevel an.',
                'phone' => '+43 660 472 9183',
                'profile_image' => 'https://gcp-na-images.contentstack.com/v3/assets/bltea6093859af6183b/blt8607a69775818780/69886306524fc0da16df4708/gettyimages-475677960.jpg?branch=production',
            ],
            'Danny Rand' => [
                'bio' => 'Trainer für Beweglichkeit, Körperkontrolle und achtsames Ganzkörpertraining. Danny kombiniert Mobility, Balance und Kraftübungen zu strukturierten, technisch sauberen Einheiten.',
                'phone' => '+43 660 305 7741',
                'profile_image' => 'https://s3.r29static.com/bin/entry/87d/x/1764032/image.png',
            ],
            'Colleen Wing' => [
                'bio' => 'Expertin für Techniktraining, Ausdauer und koordinative Workouts. Colleen legt Wert auf präzise Bewegungsabläufe, klare Progressionen und motivierende Gruppendynamik.',
                'phone' => '+43 660 829 4602',
                'profile_image' => 'https://cdn.mos.cms.futurecdn.net/Duh8swXNvmec3JcLYyo7VF.jpg',
            ],
            'Misty Knight' => [
                'bio' => 'Schwerpunkt auf Reha-orientiertem Krafttraining, Stabilität und nachhaltiger Leistungssteigerung. Misty arbeitet strukturiert, aufmerksam und mit starkem Fokus auf Belastbarkeit.',
                'phone' => '+43 660 613 5087',
                'profile_image' => 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/7f/Misty_smile.jpg/revision/latest?cb=20160922010102',
            ],
        ];

        $trainers = User::where('role', 'trainer')->get();

        foreach ($trainers as $trainer) {
            $data = $trainerData[$trainer->user_name] ?? [
                'bio' => 'Erfahrene:r Fitness Trainer:in mit Fokus auf funktionelles Training, saubere Technik und nachhaltige Fortschritte.',
                'phone' => '+43 660 000 0000',
                'profile_image' => null,
            ];

            TrainerData::create([
                'user_id' => $trainer->id,
                'bio' => $data['bio'],
                'phone' => $data['phone'],
                'contact_mail' => $trainer->email,
                'profile_image' => $data['profile_image'],
            ]);
        }
    }
}
