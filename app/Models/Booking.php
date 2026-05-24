<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model für eine Buchung eines Users.
 */
class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Verknüpft die Buchung mit dem zugehörigen User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Verknüpft eine Buchung mit mehreren Kursterminen über die Pivot-Tabelle.
     */
    public function sessions(): BelongsToMany
    {
        return $this->belongsToMany(
            CourseSession::class,
            'session_bookings',
            'booking_id',
            'session_id'
        )->withPivot(['status', 'cancelled_at'])
            ->withTimestamps();
    }

    /**
     * Gibt die direkten Einträge der Terminbuchungen zurück.
     */
    public function sessionBookings(): HasMany
    {
        return $this->hasMany(SessionBooking::class, 'booking_id', 'id');
    }
}
