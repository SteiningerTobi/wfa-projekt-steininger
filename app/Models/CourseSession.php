<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;


class CourseSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'start_date',
        'duration',
        'status',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'duration' => 'integer',
        'status' => 'string',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function bookings()
    {
        return $this->belongsToMany(
            Booking::class,
            'session_bookings',
            'session_id',
            'booking_id'
        )->withPivot(['status', 'cancelled_at'])
            ->withTimestamps();
    }

    public function sessionBookings()
    {
        return $this->hasMany(SessionBooking::class, 'session_id');
    }

    public static function updatePastSessions(): void
    {
        self::where('status', 'planned')
            ->where('start_date', '<', Carbon::now())
            ->update([
                'status' => 'past',
            ]);
    }
}
