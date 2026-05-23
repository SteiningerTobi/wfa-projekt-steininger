<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

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

    public function sessionBookings(): HasMany
    {
        return $this->hasMany(SessionBooking::class, 'booking_id', 'id');
    }
}
