<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Trainer
        User::create([
            'user_name' => 'Luke Cage',
            'email' => 'luke.cage@harlemfitness.test',
            'password' => Hash::make('password'),
            'role' => 'trainer',
        ]);

        User::create([
            'user_name' => 'Jessica Jones',
            'email' => 'jessica.jones@aliastraining.test',
            'password' => Hash::make('password'),
            'role' => 'trainer',
        ]);

        User::create([
            'user_name' => 'Danny Rand',
            'email' => 'danny.rand@randwellness.test',
            'password' => Hash::make('password'),
            'role' => 'trainer',
        ]);

        User::create([
            'user_name' => 'Colleen Wing',
            'email' => 'colleen.wing@chikaradojo.test',
            'password' => Hash::make('password'),
            'role' => 'trainer',
        ]);

        User::create([
            'user_name' => 'Misty Knight',
            'email' => 'misty.knight@knightmobility.test',
            'password' => Hash::make('password'),
            'role' => 'trainer',
        ]);

        // Teilnehmer
        User::create([
            'user_name' => 'Matt Murdock',
            'email' => 'matt.murdock@hellskitchen.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        User::create([
            'user_name' => 'Frank Castle',
            'email' => 'frank.castle@castlepersonal.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        User::create([
            'user_name' => 'Karen Page',
            'email' => 'karen.page@pagecommunications.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        User::create([
            'user_name' => 'Foggy Nelson',
            'email' => 'foggy.nelson@nelsonlegal.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        User::create([
            'user_name' => 'Claire Temple',
            'email' => 'claire.temple@metrocare.test',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }
}
