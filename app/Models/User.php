<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

/**
 * User-Model für Authentifizierung, Rollen und JWT-Token.
 */
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Verknüpft einen Trainer-User mit seinen zusätzlichen Trainerdaten.
     */
    public function trainerData(): HasOne
    {
        return $this->hasOne(TrainerData::class, 'user_id');
    }

    /**
     * Verknüpft einen Trainer-User mit seinen erstellten Kursen.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'trainer_id');
    }

    /**
     * Verknüpft einen User mit seinen Buchungen.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Gibt die eindeutige ID zurück, die im JWT gespeichert wird.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Fügt eigene Userdaten zum JWT hinzu.
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'user' => [
                'id' => $this->id,
                'role' => $this->role,
            ],
        ];
    }
}
